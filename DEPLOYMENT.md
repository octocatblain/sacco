To always keep your Django backend running on Ubuntu, use a process manager like PM2 or Gunicorn with systemd.

### Option 1: Using PM2

1. Install PM2 globally (if not already):

   ```bash
   sudo npm install -g pm2
   ```

2. Start Django with PM2:

   ```bash
   pm2 start "python manage.py runserver 0.0.0.0:8000" --name sacco_backend
   ```

3. Make PM2 restart on reboot:
   ```bash
   pm2 startup
   pm2 save
   ```

---

### Option 2: Using Gunicorn + systemd (Recommended for production)

1. Install Gunicorn:

   ```bash
   pip install gunicorn
   ```

2. Start Gunicorn:

   ```bash
   gunicorn backend.wsgi:application --bind 0.0.0.0:8000
   ```

3. Create a systemd service file:

   ```bash
   sudo nano /etc/systemd/system/sacco_backend.service
   ```

   Example content:

   ```
   [Unit]
   Description=Sacco Django Backend
   After=network.target

   [Service]
   User=www-data
   Group=www-data
   WorkingDirectory=/var/www/sacco_shield/backend
   ExecStart=/var/www/sacco_shield/backend/venv/bin/gunicorn backend.wsgi:application --bind 0.0.0.0:8000
   Restart=always

   [Install]
   WantedBy=multi-user.target
   ```

4. Enable and start the service:
   ```bash
   sudo systemctl daemon-reload
   sudo systemctl start sacco_backend
   sudo systemctl enable sacco_backend
   ```

---
