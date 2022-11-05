# Project-S0l1d1ty
## Problem Statement
The downside to a centralized ID management means that it is susceptible to a single source of failure. In event that the central ID provider is made unavailable and rendered
non-recoverable, the central ID provider/agency will not be able to perform trust attestation or authentication of users and devices.

Thus, the solution has to explore adopting a _decentralised model of doing trust attestation_ such as using blockchains, smart contracts and immutable user profiles to ensure that users and devices connecting to government networks are _authorised, authenticated, secured_ and _security posture validated constantly_. New _users and devices can also be added to the blockchain via peer-to-peer validation_.

## Concept of Claim, Attestation and Verification
### Overview of Transactions
![image](https://user-images.githubusercontent.com/115341229/199501575-7a06c797-34f1-4d94-810e-b64564bf5c34.png)


### Credential Attestation
<img src="https://user-images.githubusercontent.com/115341229/199499498-f5969f6f-c4ba-4250-8d17-7657afecf972.png" width=50% height=50%>

### Credential Verification
<img src="https://user-images.githubusercontent.com/115341229/199499555-0a09d1d0-04b0-4540-a375-441b190f797e.png" width=50% height=50%>


## Objective of PoC
Our Proof of Concept (PoC) seeks to illustrate how the concept above can be used to address the following problems in the problem statement  : 
1. adding of new users to blockchain via P2P validation
2. authentication and authorisation to service
3. constant validation of security posture

Although security of user and/or device is not demonstrated in our PoC, a high-level [suggestion](#Suggestion-for-Securing-User-Device-and-P2P-Communication) has been provided below.

Usage instructions of our PoC can be found in our [Quickstart](https://github.com/team-s0l1d1ty/Project-S0l1d1ty/wiki/Quickstart).

### Technology Stack
- Frontend : HTML/CSS/Javascript
- Middleware : [NodeJS](https://nodejs.org/en/)/[HAPI](https://hapi.dev/)
- Backend : [Kilt-Protocol](https://www.kilt.io/)

### PoC High-level Architecture
To demonstrate clearly the workflow as well as for ease of development, the PoC is built like a traditional client-server architecture but with a slight twist. 

![image](https://user-images.githubusercontent.com/115341229/199013078-2dec958b-82fb-499f-8a4a-c01c21c16055.png)


As can be seen above : 
1. Client communicates with Webserver like any Client-Server architecture.
2. Instead of an centralised authentication database / oauth system, webserver directly querying the blockchain

### PoC High-level Workflow
#### Adding of New User/Device via P2P Validation
- User Workflow

![image](https://user-images.githubusercontent.com/115341229/199014842-7a6683d0-722d-496e-ba8d-cf58a9e85273.png)

   1. A user with a Digital Identity (DID) sends claims for a particular type of credential via HTML form to server. 
   2. Server writes the information into a request for Attestation format and save as a temp file.

- Attesting Workflow
   1. [Authentication and authorisation](#Authentication-and-Authorisation) will be demonstrated below. So over, here we will just know that an attester logs in to the attester portal with an Attester Credential.
   2. After authentication, Attester would be able to access the "Attest" webservice and read the temp file.
   3. Attester would then write attestation into blockchain. Successful attestation would register the rootHash of the credential in the blockchain
   4. tmp file is then deleted. 

#### Authentication and Authorisation
Authentication and authorisation is demonstrated like logging into a service.

- Accessing Attesting Service for Attester(s)
- Accessing Services for Users with LightDID


#### Constant Validation of Security Posture
- Revocation/Removal of credentials
   1. In the same attester portal, an attester can revoke/remove credentials that they attested.
   2. When credentials are removed or revoked, they are not removed on the user-end.  
   3. The difference between revoking and removing is that the attestation for revocation is still present on the blockchain but with a revoke:true flag set. 

- Verifying of service is legitimate


## Beyond the PoC
### Suggestion for Securing User Device, and P2P Communication
Over here we will briefly discuss about the security of LightDID and FullDID as well as the security of the communication between Attester, Verifier and Claimer.

The solution that we are about to discuss is not included in the PoC to aid the rapid development of PoC but it can be built on top of the PoC to provide the security for User, Device and P2P communication

#### Securing User and Devices
In the other implementations of Kilt-Protocol as seen in [socialKYC](https://socialkyc.io/), users, attesters and verifiers are secured by an external extension the [Sporran Wallet](https://github.com/BTE-Trusted-Entity/sporran-extension). Therefore, it is viable that in a custom implementation some form of ["Cold Wallet"](https://web3isgoinggreat.com/glossary) can be implemented to ensure the safe storage of the Account and Credentials.

#### Securing P2P Communication
Apart from what the PoC has attempted to illustrate, in actual implementation a web3name is suggested to be linked to the Attester/Verifier instance. This web3name can then be verified by the user similar to what is done in this [quickstart documentation](https://docs.kilt.io/docs/develop/sdk/quickstart) done by the Kilt Team. This verification step can help in preventing malicious acts such as phishing as user can now verify if the service they giving their credentials to is legitimate or not.

P2P communication between Attester and User, Verifier and User is done over HTTP naturally has to be secure by SSL (HTTPS). 

An additional layer of security is also provided at [Application Level](https://docs.kilt.io/docs/concepts/messaging) in the [Messaging API](https://kiltprotocol.github.io/sdk-js/modules/_kiltprotocol_messaging.html) which gives additional encapsulation for user credentials and accounts. 

Examples of its implementations can be found [here](https://github.com/BTE-Trusted-Entity/socialkyc.io/search?q=encrypt).

### Achieving Decentralisation
Over here we will briefly discuss about the ideal state of implementation.

#### Distributed Trust
![image](https://user-images.githubusercontent.com/115341229/199498802-3dba5e20-8758-4d47-9fc5-9bfdbdfb3cd0.png)


