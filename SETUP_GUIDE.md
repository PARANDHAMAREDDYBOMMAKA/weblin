# Setup Guide for LinWeb

This guide will help you set up automatic deployment to Vercel using GitHub Actions.

## Prerequisites

- GitHub account
- Vercel account
- Git repository for this project

## Step 1: Create Vercel Project

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New" > "Project"
3. Import your GitHub repository
4. Configure project settings:
   - Framework Preset: **Next.js**
   - Root Directory: **.**
   - Build Command: **npm run build**
   - Output Directory: **.next**
5. Click "Deploy" (this first deployment will establish the project)

## Step 2: Get Vercel Credentials

### Get Vercel Token

1. Go to [Vercel Account Settings](https://vercel.com/account/tokens)
2. Click "Create Token"
3. Give it a name (e.g., "GitHub Actions LinWeb")
4. Set scope to your account/team
5. Click "Create Token"
6. **Copy and save this token** - you won't be able to see it again

### Get Vercel Org ID

1. Go to [Vercel Account Settings](https://vercel.com/account)
2. Scroll down to "Your ID"
3. Copy the ID (it looks like: `team_xxxxxxxxxxxxx` or `user_xxxxxxxxxxxxx`)

### Get Vercel Project ID

1. Go to your project dashboard on Vercel
2. Click on "Settings"
3. Under "General", find "Project ID"
4. Copy the Project ID (it looks like: `prj_xxxxxxxxxxxxx`)

## Step 3: Add GitHub Secrets

1. Go to your GitHub repository
2. Click "Settings" tab
3. In the left sidebar, click "Secrets and variables" > "Actions"
4. Click "New repository secret"
5. Add the following secrets one by one:

### Secret 1: VERCEL_TOKEN
- Name: `VERCEL_TOKEN`
- Value: Paste the token you created in Step 2

### Secret 2: VERCEL_ORG_ID
- Name: `VERCEL_ORG_ID`
- Value: Paste your Vercel Org/User ID

### Secret 3: VERCEL_PROJECT_ID
- Name: `VERCEL_PROJECT_ID`
- Value: Paste your Vercel Project ID

## Step 4: Initialize Git Repository (if not already done)

```bash
# Initialize git repository
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: LinWeb project"

# Add remote (replace with your repository URL)
git remote add origin https://github.com/YOUR_USERNAME/linweb.git

# Push to GitHub
git push -u origin main
```

## Step 5: Verify Deployment

1. After pushing to GitHub, go to your repository
2. Click on the "Actions" tab
3. You should see a workflow running called "Deploy to Vercel"
4. Wait for it to complete (usually takes 2-3 minutes)
5. Check your Vercel dashboard to see the deployment

## Step 6: Access Your Application

Once deployed, your application will be available at:
- Production: `https://your-project-name.vercel.app`
- Preview (for PRs): Vercel will comment on PRs with preview URLs

## Workflow Behavior

- **Push to main**: Deploys to production
- **Pull requests**: Creates preview deployments
- **Build cache**: GitHub Actions caches npm dependencies for faster builds

## Troubleshooting

### Build fails with "Missing secrets"
- Double-check that all three secrets are added to GitHub
- Ensure secret names match exactly: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`

### Build succeeds but deployment fails
- Verify your Vercel token has not expired
- Check that the token has the correct permissions
- Ensure the project ID matches your Vercel project

### v86 emulator not working after deployment
- Check browser console for errors
- Verify that the BIOS files are in `public/v86/`
- Ensure CORS headers are configured correctly in `next.config.ts`

### "SharedArrayBuffer is not defined" error
- This is due to missing COOP/COEP headers
- Verify `vercel.json` has the correct headers configuration
- Try accessing via HTTPS (not HTTP)

## Testing Locally Before Deployment

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production (test build)
npm run build

# Start production server locally
npm start
```

## Additional Configuration

### Custom Domain

1. Go to your Vercel project settings
2. Click "Domains"
3. Add your custom domain
4. Follow Vercel's DNS configuration instructions

### Environment Variables

If you need to add environment variables:

1. Go to Vercel Project Settings > Environment Variables
2. Add your variables for Production, Preview, and Development
3. Redeploy to apply changes

## Cost Considerations

- **Vercel Free Tier**: Includes 100 GB bandwidth per month
- **v86 Downloads**: Linux ISOs are downloaded from external mirrors (not from your Vercel deployment)
- **No Server Costs**: Everything runs client-side in the browser

## Security Notes

- Never commit `.env` files with real credentials
- Keep your Vercel token secret
- Rotate tokens periodically
- Use GitHub's secret scanning to detect exposed tokens

## Support

If you encounter issues:
1. Check the GitHub Actions logs
2. Check Vercel deployment logs
3. Review browser console for client-side errors
4. Open an issue on the GitHub repository
