FARMFEED CALCULATOR — OFFLINE SETUP

WHAT IS INCLUDED
- TMR calculator using live weight, target dry-matter intake percentage and TMR dry-matter percentage.
- 2, 3 or 4 servings per day.
- Sheep and goat animal register.
- Feed calculation history.
- JSON backup export/import.
- Offline caching for installable PWA use.

IMPORTANT FEEDING SAFETY
The default 3% dry-matter intake is an editable example, NOT a veterinary or nutritionist-approved recommendation for every animal. Age, weaning status, milk intake, health, forage, production target and feed composition affect the ration.
The user's photographed TrueMeal label appeared to show 60% dry matter and 18% crude protein on a dry-matter basis. The label photo did not establish the ME unit or prove that this particular product is safe/complete for sheep. Confirm sheep suitability and copper level with the manufacturer or a livestock nutritionist before feeding it as the sole ration. Do not add minerals blindly.
Formula used:
Daily TMR as-fed (kg) = live weight (kg) × target DM intake (%) ÷ TMR DM fraction.
Example only: 16 kg × 3% ÷ 60% = 0.8 kg/day as-fed.

WINDOWS LAPTOP — FIRST SETUP
1. Extract this ZIP into a folder.
2. Install Python 3 if not already installed.
3. Open Command Prompt in the extracted folder.
4. Run: python -m http.server 8000
5. In Chrome or Edge, open: http://localhost:8000
6. Keep the server running while opening the app for initial setup. The browser caches the app.
7. For install, use the browser's Install app option if available.
8. After first successful load, test by disconnecting internet and reopening the installed app.

ANDROID PHONE — FIRST SETUP
A PWA needs a secure origin (HTTPS) to install and cache offline on Android. Upload these files to a static HTTPS host (for example, GitHub Pages) or serve them from a secure local network host.
1. Open the hosted HTTPS address in Chrome while online.
2. Wait for the app to load fully once.
3. Chrome menu → Add to Home screen / Install app.
4. Open it once, then turn on Airplane mode and test.
Do not delete browser site data; that may remove locally saved records and offline cache.

DATA AND PRIVACY
- Animal and feed records are stored in browser localStorage on that device only.
- Phone and laptop do NOT automatically share records. Export a JSON backup on one device and import it on the other.
- Export backups regularly. Clearing browser data can erase records.
- No account, cloud sync or subscription is used by this app.

TROUBLESHOOTING
- If offline page does not open, visit online once and reload, then test offline.
- Service workers require localhost or HTTPS; opening index.html directly as a file will run the calculator in many browsers but will not enable PWA offline installation/caching.
