<img align="left" width="80" height="80" src="src/assets/logo/main_icon.png" alt="Kronos Mobile Wallet Icon">

# Kronos Mobile Wallet


Website: [kronowallet.org](https://kronoswallet.org)

<p style="align-items: center">
  <img src="./src/assets/screenshots/send_transaction.png" width="33%" alt="Send Transaction" />
  <img src="./src/assets/screenshots/main.png" width="33%" alt="Main"/> 
  <img src="./src/assets/screenshots/receive_transaction.png" width="33%" alt="Receive Transaction" />
</p>

> Kronos Wallet is a homebrewed, open-source, non-custodial, Bitcoin/Litecoin/Denarius Electrum wallet for iOS & Android.

Built with React Native, Kronos Wallet utilizes Electrum's JSON-RPC methods to interact with the Bitcoin/Litecoin/Denarius networks.

Kronos Wallet's intended use is as a hot wallet.
Meaning, your keys are only as safe as the device you install this wallet on.
As with any hot wallet, please ensure that you keep only a small, responsible amount of Bitcoin/Litecoin/Denarius on it at any given time.

### Features
* Bitcoin/Litecoin/Denarius Mainnet & Testnet supported
* Bech32 support
* Multiple wallet support
* Electrum
    * Support for both random and custom peers
* Encrypted storage
* Biometric + Pin authentication
* Custom fee selection
* Import mnemonic phrases via manual entry or scanning
* RBF functionality
* BIP39 Passphrase functionality
* Support for Segwit-compatible & legacy addresses in settings
* Support individual private key sweeping
* UTXO blacklisting
    * Accessible via the Transaction Detail view, this allows users to blacklist any utxo that they do not wish to include in their list of available utxo's when sending transactions. Blacklisting a utxo excludes it's amount from the wallet's total balance.
* Ability to Sign & Verify Messages
* Support BitID for passwordless authentication
* Coin Control
    * This can be accessed from the Send Transaction view and basically allows users to select from a list of available UTXO's to include in their transaction.
* Broadcast raw transactions

If you do not see a feature that you want feel free to create a new issue requesting it or reach out at support@kronoswallet.org and let me know.

### Installation
1. Clone Moonshine and Install Dependencies:
   `git clone https://github.com/carsenk/kronosmobile && cd kronosmobile && yarn install`
2. Start the project:
    - iOS: `react-native run-ios`
    - Android: `react-native run-android`

### Create Your Own Build
- `git clone https://github.com/carsenk/kronosmobile && cd kronosmobile && yarn install && yarn bundle`

### Create a Reproducible Build
This method requires docker to create a reproducible build and takes quite some time. However, it will allow you to verify against the most recently available build on Google Play.

A few things to note though.
First, this method only works if using the same version that is currently available on the Play Store.
Second, you'll need to be sure that you're comparing the correct apk files depending on the device you're using (x86, x86_64, v7a, arm64-v8a).
Third, make sure you're building with a clean, unmodified clone of moonshine by following the steps below. Modifying the code in any way will result in a failed apkdiff.py check.

1. Clone and cd into the latest release:
    - `basename $(curl -Ls -o /dev/null -w %{url_effective} https://github.com/coreyphillips/moonshine/releases/latest) | { IFS= read -r tag; git clone -b ${tag} https://github.com/coreyphillips/moonshine; }`
    - `cd moonshine`
2. Run docker and create the build. Once built, the apks will be located in "moonshine/android/app/build/outputs/apk/release/":
    - `docker run --rm --name moonshine-build -v ${PWD}:/pwd -w /pwd coreylphillips/react-native-android bash -c "source ~/.bash_profile && yarn install && cd nodejs-assets/nodejs-project && yarn install && cd ../../android && ./gradlew clean && cd .. && yarn bundle"`
3. Fetch the apk from Google Play using a service of your choice. I've listed a few below:
    - https://github.com/rehmatworks/gplaydl
    - https://github.com/onyxbits/raccoon4
    - (Web-based) https://apkbucket.net/apk-downloader/
4. Use [apkdiff.py](https://gist.github.com/coreyphillips/38c35623be4b6241cfe7623e301437b0) to compare the apk files. Example usage:
    - `python apkdiff.py googleplay.apk local.apk` 

### Contributing

1. Fork it (<https://github.com/coreyphillips/moonshine>)
2. Create your feature branch (`git checkout -b feature/fooBar`)
3. Commit your changes (`git commit -am 'Add some fooBar'`)
4. Push to the branch (`git push origin feature/fooBar`)
5. Create a new Pull Request

### Altcoin Support
Please be aware and take note that my primary focus is on expanding the core functionality of this wallet and not on adding altcoins. However, for those wishing to add a specific altcoin for personal use, I have created the following guide so that you may fork off in a proper fashion:
[Altcoin Implementation Guide](https://gist.github.com/coreyphillips/91de5d15964797054988522664cc3150)
 
 If you have any questions regarding this guide I'm always happy to help so don't hesitate to reach out.

### Support

Supported Derivation Paths: m/44' | 49' | 84' /0'/0'

### Meta

Corey Phillips – [@coreylphillips](https://twitter.com/coreylphillips)
Carsen Klock - [@carsenjk](https://twitter.com/carsenjk)

Distributed under the MIT license. See ``LICENSE`` for more information.

[https://github.com/coreyphillips/moonshine](https://github.com/coreyphillips/moonshine)

### License [MIT](https://github.com/coreyphillips/moonshine/blob/master/LICENSE)

### Acknowledgments
* Giant shoutout to the authors and contributors of the following projects along with everyone who has taken the time to provide feedback and help me through this process of learning and development. You are all awesome:
    * [bitcoinjs-lib](https://github.com/bitcoinjs/bitcoinjs-lib)
        * For providing a powerful library with detailed documentation capable of handling all of the necessary client-side, Bitcoin-related heavy-lifting.
    * [Electrum](https://electrum.org)
        * For providing a simple and flexible way to interact with the Bitcoin network.
    * [Lightning-App](https://github.com/lightninglabs/lightning-app)
        * For providing the initial inspiration for the main UI of this app and for providing a wonderful guide/example of how to implement Lightning via Neutrino.
    * Testers!
        * Thank you for the encouragement, exceptional feedback and help troubleshooting throughout the development process. You are a large part of what makes this community great. Thank you!
        * Special shoutout to the Groestlcoin team for their awesome help with QA and bug catching as they setup their own [fork.](https://github.com/Groestlcoin/moonshine/tree/grs)
