# 1. Go to your exodus2 project folder
cd C:\Users\gelta\exodus2

# 2. Update the lockfile (this fixes the frozen error)
bun install

# 3. Check what changed
git status

# 4. Add all changes
git add .

# 5. Commit with the correct message
git commit -m "Fix frozen lockfile and deploy v18.2 Obsidian Suture"

# 6. Push to GitHub
git push origin master
