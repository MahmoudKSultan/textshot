pub mod domain;
pub mod application;
pub mod infrastructure;
pub mod presentation;
pub mod shared;

use shared::config::AppConfig;
use std::sync::Mutex;
use tauri::{
    Manager,
    menu::{MenuBuilder, MenuItemBuilder},
    tray::TrayIconBuilder,
};

pub struct AppState {
    pub config: Mutex<AppConfig>,
}

pub fn run() {
    tracing_subscriber::fmt()
        .with_env_filter(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "textshot=info".into()),
        )
        .init();

    tauri::Builder::default()
        .plugin(tauri_plugin_clipboard_manager::init())
        .manage(AppState {
            config: Mutex::new(AppConfig::default()),
        })
        .setup(|app| {
            let capture = MenuItemBuilder::with_id("capture", "Take Screenshot").build(app)?;
            let show = MenuItemBuilder::with_id("show", "Show Window").build(app)?;
            let quit = MenuItemBuilder::with_id("quit", "Quit").build(app)?;

            let menu = MenuBuilder::new(app)
                .item(&capture)
                .item(&show)
                .separator()
                .item(&quit)
                .build()?;

            TrayIconBuilder::new()
                .icon(app.default_window_icon().unwrap().clone())
                .tooltip("TextShot")
                .menu(&menu)
                .on_menu_event(|app, event| {
                    match event.id().as_ref() {
                        "capture" => {
                            if let Some(window) = app.get_webview_window("main") {
                                let _ = window.unminimize();
                                let _ = window.set_focus();
                            }
                            std::thread::spawn({
                                let app = app.clone();
                                move || presentation::commands::capture::run_capture(&app)
                            });
                        }
                        "show" => {
                            if let Some(window) = app.get_webview_window("main") {
                                let _ = window.unminimize();
                                let _ = window.set_focus();
                            }
                        }
                        "quit" => {
                            app.exit(0);
                        }
                        _ => {}
                    }
                })
                .build(app)?;

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            presentation::commands::capture::capture_screen,
            presentation::commands::capture::get_settings,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
