# Task 2k — CSS Theme Developer

## Task: Update globals.css with dark navy + gold theme from reference site

### Work Completed
- Complete rewrite of `/home/z/my-project/src/app/globals.css` with reference site dark navy + gold palette
- Updated `/home/z/my-project/src/app/layout.tsx` to default to dark mode

### Key Changes

#### CSS Variables Updated
| Variable | Old Value | New Value |
|----------|-----------|-----------|
| --background | oklch(0.99...) white | oklch(0.11 0.03 255) #0B1628 |
| --foreground | oklch(0.17...) navy | oklch(0.93 0.01 250) #E2E8F0 |
| --card | oklch(1...) white | oklch(0.18 0.035 258) #162032 |
| --border | oklch(0.92...) light | oklch(0.22 0.04 260) #1E3048 |
| --primary | navy | gold #C9A227 |
| --muted-foreground | oklch(0.50...) | oklch(0.68 0.02 250) #94A3B8 |

#### Brand Color Tokens Updated
- navy: #0D1B3D → #0B1628
- navy-light: #1A2D52 → #112240
- navy-dark: #081228 → #070E1A

#### New Tokens Added
- --color-navy-card: #162032
- --color-navy-border: #1E3048
- --color-slate-primary: #E2E8F0
- --color-slate-secondary: #94A3B8
- --color-slate-tertiary: #64748B
- --font-serif: Playfair Display variable

#### New Utility Classes
- .ink-line — subtle gradient border line
- .ink-line-gold — gold accent divider
- .text-slate-primary/secondary/tertiary — text color utilities

#### Layout Change
- ThemeProvider defaultTheme: "light" → "dark"

### Files Modified
1. `/home/z/my-project/src/app/globals.css` — Complete rewrite
2. `/home/z/my-project/src/app/layout.tsx` — defaultTheme change

### Verification
- `bun run lint` — 0 errors
- Dev server compiles successfully
