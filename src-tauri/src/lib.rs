use std::collections::HashMap;
// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use std::fs::File;
use std::io::prelude::*;

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn set_always_on_top(window: tauri::Window, always_on_top: bool) {
    window.set_always_on_top(always_on_top).unwrap();
}

#[tauri::command]
fn submit(result: HashMap<String, String>) {
    let dir_path = "C:\\wt-esport-scoreboard"; // TODO: Update to project path
    if !std::path::Path::new(dir_path).exists() {
        std::fs::create_dir_all(dir_path).expect("Unable to create directory");
    }
    for (key, value) in result.iter() {
        let file_path = format!("{}\\{}.txt", dir_path, key);
        let mut file = File::create(file_path).expect("Unable to create file");
        file.write_all(format!("{}", value).as_bytes())
            .expect("Unable to write data");
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![greet, set_always_on_top, submit])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
