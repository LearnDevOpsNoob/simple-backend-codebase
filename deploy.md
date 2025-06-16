EC2 Deployment via GitHub Actions (Node.js Backend)

This guide helps you set up automatic deployment of your Node.js backend to an AWS EC2 instance using GitHub Actions.

✅ Overview

✅ Push to main → auto-deploy to EC2

✅ Pulls latest code, installs dependencies, and restarts the server

🔐 1. SSH Authentication Setup

A. Generate a Deploy SSH Key on EC2 (no passphrase)

ssh-keygen -t ed25519 -C "github-deploy" -f ~/.ssh/github_deploy_key -N ""

B. Add Public Key to GitHub Repository

Go to GitHub → Repo → Settings → Deploy Keys

Click "Add deploy key"

Title: EC2 Deploy Key

Paste contents of ~/.ssh/github_deploy_key.pub

✅ Check Allow write access

C. Configure SSH for GitHub Access

Create ~/.ssh/config on EC2:

Host github.com
  HostName github.com
  User git
  IdentityFile ~/.ssh/github_deploy_key
  IdentitiesOnly yes

🔐 2. Add EC2 SSH Key to GitHub Secrets

On EC2, run:

cat ~/.ssh/id_your_ec2_key.pem

In GitHub Repo → Settings → Secrets and variables → Actions → New repository secret, add:

Name

Value

EC2_SSH_KEY

Paste private key content (.pem)

EC2_USERNAME

e.g. ubuntu

EC2_HOST

Your EC2 public IP

EC2_APP_DIR

Full path to app, e.g., /home/ubuntu/app

⚙️ 3. Final GitHub Actions Workflow

name: Deploy backend to EC2

on:
  push:
    branches:
      - main

jobs:
  deploy:
    name: Deploy backend to EC2
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Add SSH Key
        run: |
          echo "${{ secrets.EC2_SSH_KEY }}" > ec2-key.pem
          chmod 600 ec2-key.pem

      - name: Connect to EC2 and Deploy
        run: |
          ssh -o StrictHostKeyChecking=no -i ec2-key.pem ${{ secrets.EC2_USERNAME }}@${{ secrets.EC2_HOST }} << 'EOF'
            cd ${{ secrets.EC2_APP_DIR }}

            git pull origin main

            npm install

            nohup node server.js > output.log 2>&1 &
          EOF

🧠 Tips & Gotchas

⚠️ Use passphrase-less deploy key for GitHub repo access.

🔐 Store your .pem EC2 key as a GitHub secret (EC2_SSH_KEY).

✅ git pull works only when GitHub recognizes EC2 via Deploy Key.

⚠️ nvm won't auto-load in SSH sessions unless explicitly sourced (or use plain node).

🚫 Do not use passphrase-protected keys unless you manage ssh-agent.

If sometimes you feel that code is not updated, can happen due to previous process running in the back ground, so just add - pkill -f "node server.js" || true 
BEFORE
nohup node server.js


WHT to do if we stop and re-run the EC2 Instance - 
✅ EBS Volume (your files)	Remains intact — all files, code, keys, and installed packages persist.
❌ Public IPv4 Address	Changes by default unless you use an Elastic IP.
❌ Running Processes	All running processes (e.g., node server.js) are stopped and need to be restarted.
⚠️ Firewall/Security Group	Remains as-is (rules don't reset), but you must ensure port 3000 is still open.
Update GitHub Secrets (if public IP changed) -> Settings > Secrets > Actions -> EC2_HOST


