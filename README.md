# NUFFI - Developer Workspace Management Platform

NUFFI to kompletna platforma do zarządzania środowiskami deweloperskimi, zbudowana z wykorzystaniem Tauri 2.8, React 18.3 i TypeScript.

## 🚀 Funkcje

- **Zarządzanie workspace'ami**: Tworzenie, aktywacja i zarządzanie środowiskami deweloperskimi
- **Skaner systemu**: Automatyczne wykrywanie zainstalowanych narzędzi deweloperskich
- **Szablony workspace'ów**: Gotowe konfiguracje dla różnych typów projektów
- **Aplikacja desktopowa**: Natywna aplikacja na macOS, Windows i Linux
- **Interfejs webowy**: Dostęp przez przeglądarkę podczas developmentu

## 🛠 Technologie

- **Frontend**: React 18.3 + TypeScript + Tailwind CSS
- **Backend**: Rust + Tauri 2.8
- **Stan**: Zustand
- **Routing**: React Router
- **Ikony**: Lucide React
- **Powiadomienia**: React Hot Toast

## 📦 Instalacja

### Wymagania
- Node.js 18+
- Rust 1.77+
- Tauri CLI

### Kroki instalacji

1. **Klonuj repozytorium**
   ```bash
   git clone <repo-url>
   cd nuffi
   ```

2. **Zainstaluj zależności**
   ```bash
   npm install
   ```

3. **Uruchom w trybie deweloperskim**
   
   **Aplikacja webowa:**
   ```bash
   npm run dev
   ```
   Otwórz http://localhost:1420
   
   **Aplikacja desktopowa:**
   ```bash
   cargo tauri dev
   ```

4. **Zbuduj aplikację produkcyjną**
   ```bash
   cargo tauri build
   ```

## 🎯 Użytkowanie

### Główne funkcje:

1. **Workspace Hub** - Zarządzaj swoimi środowiskami deweloperskimi
2. **Create Workspace** - Twórz nowe workspace'y z szablonów lub od zera
3. **System Scanner** - Skanuj system w poszukiwaniu zainstalowanych narzędzi
4. **Settings** - Konfiguruj preferencje aplikacji

### Szybki start:

1. Uruchom aplikację
2. Przejdź do "System Scanner" i zeskanuj swój system
3. Utwórz nowy workspace w "Create Workspace"
4. Zarządzaj workspace'ami w "Workspace Hub"

## 📁 Struktura projektu

```
nuffi/
├── src/                    # Frontend React
│   ├── components/         # Komponenty React
│   ├── pages/             # Strony aplikacji
│   ├── services/          # Logika biznesowa
│   ├── stores/            # Zarządzanie stanem (Zustand)
│   ├── types/             # Definicje TypeScript
│   └── utils/             # Funkcje pomocnicze
├── src-tauri/             # Backend Rust
│   ├── src/               # Kod Rust
│   └── Cargo.toml         # Zależności Rust
├── public/                # Pliki statyczne
└── package.json           # Zależności Node.js
```

## 🔧 Rozwój

### Dodawanie nowych funkcji:

1. **Nowe komponenty**: Dodaj w `src/components/`
2. **Nowe strony**: Dodaj w `src/pages/` i zaktualizuj routing w `App.tsx`
3. **Nowe serwisy**: Dodaj w `src/services/`
4. **Nowe typy**: Dodaj w `src/types/index.ts`

### Tauri commands:

Dodaj nowe komendy Rust w `src-tauri/src/main.rs` i użyj ich w frontend przez `invoke()`.

## 🐛 Rozwiązywanie problemów

### Częste problemy:

1. **Błędy kompilacji Tauri**: Sprawdź czy masz zainstalowany Rust i Tauri CLI
2. **Błędy TypeScript**: Sprawdź definicje typów w `src/types/`
3. **Problemy z zależnościami**: Usuń `node_modules` i uruchom `npm install`

### Logi:

- **Frontend**: Konsola przeglądarki (F12)
- **Tauri**: Terminal gdzie uruchomiłeś `cargo tauri dev`

## 📝 Licencja

MIT License

## 🤝 Wkład

1. Fork projektu
2. Stwórz branch dla swojej funkcji (`git checkout -b feature/AmazingFeature`)
3. Commit zmiany (`git commit -m 'Add some AmazingFeature'`)
4. Push do branch (`git push origin feature/AmazingFeature`)
5. Otwórz Pull Request

---

**NUFFI v1.0.0** - Profesjonalna platforma zarządzania środowiskami deweloperskimi