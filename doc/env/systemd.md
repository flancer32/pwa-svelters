# `systemd` setup

Create service description `/home/${user}/sys/pwa-${name}.service` using `./doc/env/systemd.md` as a template and make a
link to the file from `/etc/systemd/system/`:

```shell
$ cd /etc/systemd/system/
$ sudo ln -s /home/${user}/sys/pwa-${name}.service
```

... then reload daemon and setup service loading on startup:

```shell
$ sudo systemctl daemon-reload
$ sudo systemctl enable pwa-${name}
```

To start/stop the service:

```shell
$ sudo systemctl start pwa-${name}
$ sudo systemctl stop pwa-${name}
```

Create this file (`/etc/sudoers.d/${user}`) to allow service restart for user `${user}` as `sudo` without password:

```
${user} ALL=(ALL) NOPASSWD: /bin/systemctl start pwa-${name}.service
${user} ALL=(ALL) NOPASSWD: /bin/systemctl stop pwa-${name}.service
```

### Log rotation

Create this configuration in `/etc/logrotate.d/pwa-${name}` to rotate `/home/${user}/store/${name}/log/out.log` file:

```
/home/${user}/store/${name}/log/out.log {
    copy
    dateext
    dateformat _%Y%m%d_%s
    missingok
    su ${user} ${user}
    olddir /home/${user}/store/${name}/log/old
    createolddir 770 ${user} ${user}
    rotate 30
    size 100M
    postrotate
        systemctl restart pwa-${name}
    endscript
}
```