Follow the steps below to generate a self signed certificate

_Note: this is only done in the dev environment, when deployed need to provide a proper ssl certificate_

> Reference to the [stackoverflow article](https://meta.stackexchange.com/questions/164194/is-there-a-way-to-shorten-stack-overflow-urls)

**Step 1.** create a folder inside your project where you want to store the credential, eg. ./credentials

**Step 2.** create a request config file named `req.cnf` with the following content

```
[req]
distinguished_name = req_distinguished_name
x509_extensions = v3_req
prompt = no
[req_distinguished_name]
C = Country initials like US, RO, GE
ST = State
L = Location
O = Organization Name
OU = Organizational Unit 
CN = www.localhost.com
[v3_req]
keyUsage = critical, digitalSignature, keyAgreement
extendedKeyUsage = serverAuth
subjectAltName = @alt_names
[alt_names]
DNS.1 = www.localhost.com
DNS.2 = localhost.com
DNS.3 = localhost
```
_Note: make sure that all items has value_
> More info of the above contents are found [here](https://www.globalsign.com/en/blog/what-is-a-certificate-signing-request-csr)

**Step 3.** in the terminal navigate to the directory where you created the `req.cnf` file and type the following command :
```
openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout cert.key -out cert.pem -config req.cnf -sha256
```
_Note: add `sudo` at the beginning of the command if necessary_
>Output:
```
Generating a RSA private key
..............................................+++++
......................................................................+++++
writing new private key to 'cert.key'
-----
```

You should see a cert.key and cert.pem generated in the folder
