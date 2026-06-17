pub fn normalize_text(text: &str) -> String {
    text.lines()
        .map(|line| line.trim().to_string())
        .collect::<Vec<_>>()
        .join("\n")
        .trim()
        .to_string()
}
