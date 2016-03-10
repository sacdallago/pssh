# Store key and certificate here

To generate a self signed key and certificate via openssl use the terminal and type:

```
openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -days XXX
```

If node complains about `bad password read`, reset the password useing:

```
openssl rsa -in key.pem -out newkey.pem && mv newkey.pem key.pem
```