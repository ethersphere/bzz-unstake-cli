# bzz-unstake-cli
A cli tool to unstake xBZZ from the [paused staking contract](https://gnosisscan.io/address/0x781c6d1f0eae6f1da1f604c6cdccdb8b76428ba7#code).

Note: if you have migrated to bee 2.2 there is no need to revert to older versions. Doing so may lead to bee data corruption.

## Requirements
- `node` >= 20

## Setup
```
git clone https://github.com/w3rkspacelabs/bzz-unstake-cli.git
cd bzz-unstake-cli
npm install
```
## Unstaking you `xBZZ`

### Usage
> #### For Dappnode users:
> 1. Connect to your dappnode using `Wireguard` or `OpenVPN`
> 2. Once you've established connection:
> - Download your `swarm.key` file:
>   - http://my.dappnode/file-download/DAppNodePackage-bee.swarm.public.dappnode.eth/?path=/home/bee/.bee/keys/swarm.key
> - Download your password.tar file and extract your password:
>   - http://my.dappnode/file-download/DAppNodePackage-bee.swarm.public.dappnode.eth/?path=/home/bee/.bee/password
> 3. Unstake with the commands below 

### Unstake CLI

#### Unstake with swarm.key and password
```
tsx src/index.ts unstake <path-to-swarm-key-file> <password> <gnosis-rpc-url>
```

#### Unstake with private key
```
tsx src/index.ts unstake <private-key> <gnosis-rpc-url>
```

**Output:**
```
Staked amount available for withdrawal: 110000000000000000
Withdraw stake transaction sent: 0x123abc7d956606ac0083b0356e4bd5351276b854c732e4f78357a4a722932dfc
Withdraw stake transaction completed!
```

## Restaking your `xBZZ`

Once the `xBZZ` is unstaked, you may now stake your prefered amount of `xBZZ` (minimum `10 xBZZ` )

> #### For Dappnode users:
> ##### Option 1: Using bee dashboard on Dappnode
> Dappnode users may restake using the bee dashboard at:
> - http://dashboard.swarm.public.dappnode/#/account/staking
> ![image](https://github.com/user-attachments/assets/dddc41ac-795a-425a-9b20-36a2e28779d0)
> 
> ##### Option 2: Using swarm-cli with Dappnode
> To stake 10 xBZZ:
> ```
> swarm-cli stake --deposit 100000000000000000 --bee-api-url http://bee.swarm.public.dappnode:1633
> ```
> 
> ##### Option 3: Using curl with Dappnode
> To stake 10 xBZZ:
> ```
> curl -X POST http://bee.swarm.public.dappnode:1633/stake/100000000000000000
> ```

### Restaking

To restake `10 xBZZ` (`100000000000000000 PLUR`)

### Option 1: Using curl
```
curl -X POST localhost:1633/stake/100000000000000000
```
### Option 2: Using swarm-cli
```
 swarm-cli stake --deposit 100000000000000000 --bee-api-url http:localhost:1633
```

