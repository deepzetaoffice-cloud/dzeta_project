# P0 setup guide: the steps only you can do

Written 2026-09-30 for the P0 Foundation plan (`docs/plans/2026-09-30-p0-foundation.md`). About 15 minutes in total. Do the steps in order.

Why you: Claude Code is blocked, on purpose, from creating `.env` files, changing Vercel settings and merging into `main`. That keeps secrets and the live site under your control.

---

## 1. Restart VS Code (1 minute)

Node.js is installed, but VS Code was opened before Node was added to Windows' PATH, so the project's automatic checks can't find it yet.

1. Close **every** VS Code window.
2. Open VS Code again, then open the folder `D:\DeepZeta Ai\Website DeepZeta`.
3. **Check:** open a terminal (**Terminal → New Terminal**) and type `node -v`. It should print `v24.19.0`.

## 2. Create `.env.local` on your computer (2 minutes)

This file holds the settings for running the site on your machine. It never goes to GitHub (the repo ignores it).

1. In VS Code's **Explorer** (left sidebar), right-click the empty space under the file list → **New File…**
2. Name it exactly `.env.local` (with the dot at the start) and press Enter.
3. Paste these two lines, then save (**Ctrl+S**):

   ```
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   SITE_INDEXING=on
   ```

4. **Check:** in the terminal, run `npm run build`. It should end with a route list that includes `○ /`.

## 3. Set the site address in Vercel (3 minutes)

Until this is set, every Vercel build stops with the message *"Invalid environment … NEXT_PUBLIC_SITE_URL is missing"*. That's the safety check doing its job.

1. Go to <https://vercel.com> → project **dzeta_project** → **Settings** → **Environment Variables**.
2. Add a variable:
   - **Key:** `NEXT_PUBLIC_SITE_URL`
   - **Value:** `https://deepzeta.ai` (no slash at the end)
   - **Environments:** tick **Production** and **Preview**
   - Save.
3. **Don't add `SITE_INDEXING` yet.** Leaving it out keeps the live site hidden from Google and AI crawlers until launch (decision 0013). At launch you'll add it with the value `on`, for **Production only**.
4. **Settings → Build and Deployment:**
   - check that **Framework Preset** is **Next.js**
   - check that **Node.js Version** is **24.x** (the project asks for 24.x in `package.json`)
5. **Deployments** → open the newest deployment of the branch `chore/p0-foundation` → **⋯** → **Redeploy**. It should now build successfully.

## 4. Merge the two pull requests (5 minutes)

**First, the docs (rules and plans):**
1. Open <https://github.com/deepzetaoffice-cloud/dzeta_project/compare/main...docs/seo-geo-domination-engine?expand=1>
2. Title: `docs: rule system, design direction and SEO/GEO engine` → **Create pull request**.
3. A red Vercel check on this PR is expected (it holds no app). Click **Merge pull request** → choose **Create a merge commit** → **Confirm**.

**Then, P0:**
1. Open <https://github.com/deepzetaoffice-cloud/dzeta_project/compare/main...chore/p0-foundation?expand=1>
2. Claude gives you the title and description text in the chat. Paste them → **Create pull request**.
3. Wait for the **verify** check to turn green (about 5 minutes), then merge with **Create a merge commit**.
4. **Check:** after about a minute, <https://deepzeta.ai> shows the placeholder page ("AI automation and custom-coded websites for UAE businesses").

## 5. Protect `main` (3 minutes)

This makes GitHub refuse any change to `main` that didn't pass every check (rule 12 §1).

1. GitHub → the repo → **Settings** → **Rules** → **Rulesets** → **New ruleset** → **New branch ruleset**. (On older screens: **Settings → Branches → Add branch protection rule**.)
2. **Ruleset name:** `main`. **Enforcement status:** **Active**.
3. **Target branches** → **Add target** → **Include default branch**.
4. Tick:
   - **Restrict deletions**
   - **Require a pull request before merging** (required approvals: **0**, since you're the only reviewer)
   - **Require status checks to pass** → **Add checks** → type `verify` → select it
   - **Block force pushes**
5. **Create**.

---

**If something looks different or fails,** copy the message into the chat and Claude will walk you through it.
