import { Scallop } from "@scallop-io/sui-scallop-sdk";
import { normalizeSuiObjectId } from "@mysten/sui.js/utils";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { bcs } from "@mysten/sui.js/bcs";
import { SuiClient } from "@mysten/sui.js/client";
import { Dex } from "kriya-dex-sdk";

const RPC_MAINNET = "https://fullnode.mainnet.sui.io:443";

const scallopSDK = new Scallop({
    networkType: "mainnet",
});

export const config = {
    ProtocolPackage:
        "0xc6374c7da60746002bfee93014aeb607e023b2d6b25c9e55a152b826dbc8c1ce",
    StorageId:
        "0xbb4e2f4b6205c2e2a2db47aeb4f830796ec7c005f88537ee775986639bc442fe",
    Incentive:
        "0xaaf735bf83ff564e1b219a0d644de894ef5bdc4b2250b126b2a46dd002331821",
    IncentiveV2:
        "0xf87a8acb8b81d14307894d12595541a73f19933f88e1326d5be349c7a6f7559c", // The new incentive version: V2

    PriceOracle:
        "0x1568865ed9a0b5ec414220e8f79b3d04c77acc82358f6e5ae4635687392ffbef",
    ReserveParentId:
        "0xe6d4c6610b86ce7735ea754596d71d72d10c7980b5052fc3c8cdf8d09fea9b4b", // get it from storage object id. storage.reserves
};

export const naviPools = {
    sui: {
        name: "SUI",
        assetId: 0,
        poolId: "0x96df0fce3c471489f4debaaa762cf960b3d97820bd1f3f025ff8190730e958c5",
        type: "0x2::sui::SUI",
        decimals: 9,
        balanceScaling: 1e27,
        ltv: 0.75,
        cgId: "sui",
        reserveObjectId:
            "0xab644b5fd11aa11e930d1c7bc903ef609a9feaf9ffe1b23532ad8441854fbfaf",
        borrowBalanceParentId:
            "0xe7ff0daa9d090727210abe6a8b6c0c5cd483f3692a10610386e4dc9c57871ba7",
        supplyBalanceParentId:
            "0x589c83af4b035a3bc64c40d9011397b539b97ea47edf7be8f33d643606bf96f8",
    },
    usdc: {
        name: "USDC",
        assetId: 1,
        poolId: "0xa02a98f9c88db51c6f5efaaf2261c81f34dd56d86073387e0ef1805ca22e39c8",
        type: "0x5d4b302506645c37ff133b98c4b50a5ae14841659738d6d733d59d0d217a93bf::coin::COIN",
        decimals: 6,
        balanceScaling: 1e30,
        ltv: 0.7,
        cgId: "usd-coin",
        reserveObjectId:
            "0xeb3903f7748ace73429bd52a70fff278aac1725d3b58afa781f25ce3450ac203",
        borrowBalanceParentId:
            "0x8a3aaa817a811131c624658f6e77cba04ab5829293d2c49c1a9cce8ac9c8dec4",
        supplyBalanceParentId:
            "0x8d0a4467806458052d577c8cd2be6031e972f2b8f5f77fce98aa12cd85330da9",
    },
    usdt: {
        name: "USDT",
        assetId: 2,
        poolId: "0x0e060c3b5b8de00fb50511b7a45188c8e34b6995c01f69d98ea5a466fe10d103",
        type: "0xc060006111016b8a020ad5b33834984a437aaa7d3c74c18e09a95d48aceab08c::coin::COIN",
        decimals: 6,
        balanceScaling: 1e30,
        ltv: 0.7,
        cgId: "tether",
        reserveObjectId:
            "0xb8c5eab02a0202f638958cc79a69a2d30055565caad1684b3c8bbca3bddcb322",
        borrowBalanceParentId:
            "0xc14d8292a7d69ae31164bafab7ca8a5bfda11f998540fe976a674ed0673e448f",
        supplyBalanceParentId:
            "0x7e2a49ff9d2edd875f82b76a9b21e2a5a098e7130abfd510a203b6ea08ab9257",
    },
    weth: {
        name: "WETH",
        assetId: 3,
        poolId: "0x71b9f6e822c48ce827bceadce82201d6a7559f7b0350ed1daa1dc2ba3ac41b56",
        type: "0xaf8cd5edc19c4512f4259f0bee101a40d41ebed738ade5874359610ef8eeced5::coin::COIN",
        decimals: 8,
        balanceScaling: 1e28,
        ltv: 0.75,
        cgId: "ethereum",
        reserveObjectId:
            "0xafecf4b57899d377cc8c9de75854c68925d9f512d0c47150ca52a0d3a442b735",
        borrowBalanceParentId:
            "0x7568d06a1b6ffc416a36c82791e3daf0e621cf19d4a2724fc6f74842661b6323",
        supplyBalanceParentId:
            "0xa668905b1ad445a3159b4d29b1181c4a62d864861b463dd9106cc0d97ffe8f7f",
    },
    cetus: {
        name: "CETUS",
        assetId: 4,
        poolId: "0x3c376f857ec4247b8ee456c1db19e9c74e0154d4876915e54221b5052d5b1e2e",
        type: "0x06864a6f921804860930db6ddbe2e16acdf8504495ea7481637a1c8b9a8fe54b::cetus::CETUS",
        decimals: 9,
        balanceScaling: 1e27,
        ltv: 0.45,
        cgId: "cetus-protocol",
        reserveObjectId:
            "0x66a807c06212537fe46aa6719a00e4fa1e85a932d0b53ce7c4b1041983645133",
        borrowBalanceParentId:
            "0x4c3da45ffff6432b4592a39cdb3ce12f4a28034cbcb804bb071facc81fdd923d",
        supplyBalanceParentId:
            "0x6adc72faf2a9a15a583c9fb04f457c6a5f0b456bc9b4832413a131dfd4faddae",
    },
    vSui: {
        name: "VOLOSUI",
        assetId: 5,
        poolId: "0x9790c2c272e15b6bf9b341eb531ef16bcc8ed2b20dfda25d060bf47f5dd88d01",
        type: "0x549e8b69270defbfafd4f94e17ec44cdbdd99820b33bda2278dea3b9a32d3f55::cert::CERT",
        decimals: 9,
        balanceScaling: 1e27,
        ltv: 0.6,
        cgId: "volo-staked-sui",
        reserveObjectId:
            "0xd4fd7e094af9819b06ea3136c13a6ae8da184016b78cf19773ac26d2095793e2",
        borrowBalanceParentId:
            "0x8fa5eccbca2c4ba9aae3b87fd44aa75aa5f5b41ea2d9be4d5321379384974984",
        supplyBalanceParentId:
            "0xe6457d247b6661b1cac123351998f88f3e724ff6e9ea542127b5dcb3176b3841",
    },
    hSui: {
        name: "HASUI",
        assetId: 6,
        poolId: "0x6fd9cb6ebd76bc80340a9443d72ea0ae282ee20e2fd7544f6ffcd2c070d9557a",
        type: "0xbde4ba4c2e274a60ce15c1cfff9e5c42e41654ac8b6d906a57efa4bd3c29f47d::hasui::HASUI",
        decimals: 9,
        balanceScaling: 1e27,
        ltv: 0.6,
        cgId: "volo-staked-sui",
        reserveObjectId:
            "0x0c9f7a6ca561dc566bd75744bcc71a6af1dc3caf7bd32c099cd640bb5f3bb0e3",
        borrowBalanceParentId:
            "0x01f36898e020be6c3423e5c95d9f348868813cd4d0be39b0c8df9d8de4722b00",
        supplyBalanceParentId:
            "0x278b8e3d09c3548c60c51ed2f8eed281876ea58c392f71b7ff650cc9286d095b",
    },
};

const kriyaSuiVsuiRoute = {
    objectId:
        "0xf385dee283495bb70500f5f8491047cd5a2ef1b7ff5f410e6dfe8a3c3ba58716",
    tokenYType:
        "0x0000000000000000000000000000000000000000000000000000000000000002::sui::SUI",
    tokenXType:
        "0x549e8b69270defbfafd4f94e17ec44cdbdd99820b33bda2278dea3b9a32d3f55::cert::CERT",
};

export const getUserBalances = async (address: string, market: string) => {
    const client = new SuiClient({ url: RPC_MAINNET });
    const reserveObjectId = naviPools[market].reserveObjectId;

    const reserveData = await client.getObject({
        id: reserveObjectId,
        options: { showContent: true },
    });

    const supplyIndex =
        // @ts-ignore
        reserveData.data.content.fields.value.fields.current_supply_index;

    const borrowIndex =
        // @ts-ignore
        reserveData.data.content.fields.value.fields.current_borrow_index;

    const supplyAmountFactor = Number(
        supplyIndex / naviPools[market].balanceScaling
    );
    const borrowAmountFactor = Number(
        borrowIndex / naviPools[market].balanceScaling
    );

    const tx = new TransactionBlock();

    tx.moveCall({
        target: "0xc6374c7da60746002bfee93014aeb607e023b2d6b25c9e55a152b826dbc8c1ce::storage::get_user_balance",
        arguments: [
            tx.object(
                "0xbb4e2f4b6205c2e2a2db47aeb4f830796ec7c005f88537ee775986639bc442fe"
            ),
            tx.pure(naviPools[market].assetId),
            tx.pure(address),
        ],
    });

    const res = await client.devInspectTransactionBlock({
        //@ts-ignore
        transactionBlock: tx,
        sender: address,
    });

    const deposited = bcs.de(
        "u256",
        new Uint8Array(res.results[0].returnValues[0][0])
    );

    const borrowed = bcs.de(
        "u256",
        new Uint8Array(res.results[0].returnValues[1][0])
    );

    const depositedScaled = deposited * supplyAmountFactor;

    const borrowedScaled = borrowed * borrowAmountFactor;

    return { depositedScaled, borrowedScaled };
};

const fetchCgPrices = async (cgIds: string[]) => {
    try {
        const response = await fetch(
            `https://api.coingecko.com/api/v3/simple/price?ids=${cgIds.join(
                ","
            )}&vs_currencies=${cgIds.map(() => "usd").join(",")}`
        );
        if (!response.ok) {
            throw new Error(`Failed to fetch data: ${response.status}`);
        }
        const jsonData = await response.json();
        return jsonData;
    } catch (e) {
        console.log(e);
    }
};

export const getAllUserBalances = async (address: string) => {
    // Fetch all the markets user has deposited borrowed from
    // Fetch balances for each market
    // Fetch reserve objects for each market
    // Form account state

    let userBalances: Record<string, { borrowed: number; supplied: number }> =
        {};

    await Promise.all(
        Object.keys(naviPools).map(async (market) => {
            const { borrowedScaled, depositedScaled } = await getUserBalances(
                address,
                market
            );

            userBalances = {
                ...userBalances,
                [market]: {
                    borrowed: borrowedScaled,
                    supplied: depositedScaled,
                },
            };

            if (market === "weth") {
            }
        })
    );

    const tokenPrices = await fetchCgPrices(
        Object.values(naviPools).map((item) => item.cgId)
    );

    const tokenPricesVsMarket: Record<string, number> = {};

    Object.keys(naviPools).forEach((item) => {
        const tokenPrice = tokenPrices[naviPools[item].cgId];
        tokenPricesVsMarket[item] = tokenPrice.usd;
    });

    // If deposited < $0.01, ignore

    Object.keys(userBalances).map((item) => {
        const supplied =
            userBalances[item].supplied /
            Math.pow(10, naviPools[item].decimals);
        const borrowed =
            userBalances[item].borrowed /
            Math.pow(10, naviPools[item].decimals);

        const suppliedUsd = supplied * tokenPricesVsMarket[item];
        const borrowedUsd = borrowed * tokenPricesVsMarket[item];

        if (borrowedUsd < 0.01) {
            userBalances[item].borrowed = 0;
        }
        if (suppliedUsd < 0.01) {
            userBalances[item].supplied = 0;
        }
    });

    return { userBalances, tokenPricesVsMarket };
};

export const leverageNaviCross = async (
    amount: number,
    loanAmount: number,
    depositMarket: string,
    borrowMarket: string
) => {
    const initialCollateralAmount = amount;

    const ksdk = new Dex(RPC_MAINNET);
    const builder = await scallopSDK.createScallopBuilder();

    const tx = builder.createTxBlock();

    let initialCoin;

    if (initialCollateralAmount > 0) {
        [initialCoin] = tx.splitCoins(tx.gas, [
            tx.pure(initialCollateralAmount),
        ]);

        if (initialCollateralAmount / 1e9 > 1) {
            [initialCoin] = tx.moveCall(
                "0x549e8b69270defbfafd4f94e17ec44cdbdd99820b33bda2278dea3b9a32d3f55::native_pool::stake_non_entry",
                [
                    tx.object(
                        "0x7fa2faa111b8c65bea48a23049bfd81ca8f971a262d981dcd9a17c3825cb5baf"
                    ),
                    tx.object(
                        "0x680cd26af32b2bde8d3361e804c53ec1d1cfe24c7f039eb7f549e8dfde389a60"
                    ),
                    tx.object(
                        "0x0000000000000000000000000000000000000000000000000000000000000005"
                    ),
                    initialCoin,
                ]
            );
        } else {
            const [initialCoinValue] = tx.moveCall(
                "0x2::coin::value",
                [initialCoin],
                [naviPools[borrowMarket].type]
            );

            initialCoin = ksdk.swapWithRoute(
                [kriyaSuiVsuiRoute],
                kriyaSuiVsuiRoute.tokenYType,
                initialCoinValue,
                initialCoin,
                BigInt(Math.floor(initialCollateralAmount * 0.95)),
                // @ts-ignore
                tx.txBlock
            );
        }
    }

    let loanRecepipt;

    if (loanAmount > 10000) {
        const [coin, loan] = tx.borrowFlashLoan(
            tx.pure(loanAmount),
            // @ts-ignore
            borrowMarket.toLowerCase()
        );

        if (loanAmount / 1e9 > 1) {
            const [stakedCoin] = tx.moveCall(
                "0x549e8b69270defbfafd4f94e17ec44cdbdd99820b33bda2278dea3b9a32d3f55::native_pool::stake_non_entry",
                [
                    tx.object(
                        "0x7fa2faa111b8c65bea48a23049bfd81ca8f971a262d981dcd9a17c3825cb5baf"
                    ),
                    tx.object(
                        "0x680cd26af32b2bde8d3361e804c53ec1d1cfe24c7f039eb7f549e8dfde389a60"
                    ),
                    tx.object(
                        "0x0000000000000000000000000000000000000000000000000000000000000005"
                    ),
                    coin,
                ]
            );

            if (initialCollateralAmount > 0) {
                tx.mergeCoins(initialCoin, [stakedCoin]);
            } else {
                initialCoin = stakedCoin;
            }
        } else {
            const swappedCoin = ksdk.swapWithRoute(
                [kriyaSuiVsuiRoute],
                kriyaSuiVsuiRoute.tokenYType,
                tx.pure(loanAmount),
                coin,
                BigInt(Math.floor(loanAmount * 0.98)),
                // @ts-ignore
                tx.txBlock
            );

            if (initialCollateralAmount > 0) {
                tx.mergeCoins(initialCoin, [swappedCoin]);
            } else {
                initialCoin = swappedCoin;
            }
        }

        loanRecepipt = loan;
    }

    const [vSuiBalance] = tx.moveCall(
        "0x2::coin::value",
        [initialCoin],
        [naviPools[depositMarket].type]
    );

    tx.moveCall(
        "0xc6374c7da60746002bfee93014aeb607e023b2d6b25c9e55a152b826dbc8c1ce::incentive_v2::entry_deposit",
        [
            tx.object(normalizeSuiObjectId("0x6")), // Clock
            tx.object(
                "0xbb4e2f4b6205c2e2a2db47aeb4f830796ec7c005f88537ee775986639bc442fe" // Storage object id
            ),
            tx.object(naviPools[depositMarket].poolId),
            tx.pure(naviPools[depositMarket].assetId),
            initialCoin,
            vSuiBalance,
            tx.object(
                "0xaaf735bf83ff564e1b219a0d644de894ef5bdc4b2250b126b2a46dd002331821"
            ),
            tx.object(
                "0xf87a8acb8b81d14307894d12595541a73f19933f88e1326d5be349c7a6f7559c"
            ),
        ],
        [naviPools[depositMarket].type]
    );

    if (loanAmount > 10000) {
        const [loanBalance] = tx.moveCall(
            "0xc6374c7da60746002bfee93014aeb607e023b2d6b25c9e55a152b826dbc8c1ce::incentive_v2::borrow",
            [
                tx.object(normalizeSuiObjectId("0x6")), // Clock
                tx.object(
                    "0x1568865ed9a0b5ec414220e8f79b3d04c77acc82358f6e5ae4635687392ffbef"
                ),
                tx.object(
                    "0xbb4e2f4b6205c2e2a2db47aeb4f830796ec7c005f88537ee775986639bc442fe"
                ),
                tx.object(naviPools[borrowMarket].poolId),
                tx.pure(naviPools[borrowMarket].assetId),
                tx.pure(loanAmount),
                tx.object(
                    "0xf87a8acb8b81d14307894d12595541a73f19933f88e1326d5be349c7a6f7559c"
                ),
            ],
            [naviPools[borrowMarket].type]
        );

        const [loanCoin] = tx.moveCall(
            "0x2::coin::from_balance",
            [loanBalance],
            [naviPools[borrowMarket].type]
        );

        // @ts-ignore
        tx.repayFlashLoan(loanCoin, loanRecepipt, borrowMarket.toLowerCase());
    }

    return tx.txBlock;
};

export const deleverageNaviCross = async (
    borrowed: number, // Flash loan amount
    suiwithdrawAmount: number,
    vSuiWithdrawAmount: number,
    address: string,
    depositMarket: string,
    borrowMarket: string
) => {
    const builder = await scallopSDK.createScallopBuilder();

    const tx = builder.createTxBlock();

    const ksdk = new Dex(RPC_MAINNET);

    const [coin, loan] = tx.borrowFlashLoan(
        tx.pure(borrowed),
        // @ts-ignore
        borrowMarket.toLowerCase()
    );

    const [rewardBalance] = tx.moveCall(
        "0xc6374c7da60746002bfee93014aeb607e023b2d6b25c9e55a152b826dbc8c1ce::incentive_v2::repay",
        [
            tx.object(normalizeSuiObjectId("0x6")), // Clock
            tx.object(
                "0x1568865ed9a0b5ec414220e8f79b3d04c77acc82358f6e5ae4635687392ffbef"
            ),
            tx.object(
                "0xbb4e2f4b6205c2e2a2db47aeb4f830796ec7c005f88537ee775986639bc442fe"
            ),
            tx.object(naviPools[borrowMarket].poolId),
            tx.pure(naviPools[borrowMarket].assetId),
            coin,
            tx.pure(borrowed),
            tx.object(
                "0xf87a8acb8b81d14307894d12595541a73f19933f88e1326d5be349c7a6f7559c"
            ),
        ],
        [naviPools[borrowMarket].type]
    );

    let intmSuiCoin1;

    if (suiwithdrawAmount > 0) {
        const [intmSuiBalance1] = tx.moveCall(
            "0xc6374c7da60746002bfee93014aeb607e023b2d6b25c9e55a152b826dbc8c1ce::incentive_v2::withdraw",
            [
                tx.object(normalizeSuiObjectId("0x6")), // Clock
                tx.object(
                    "0x1568865ed9a0b5ec414220e8f79b3d04c77acc82358f6e5ae4635687392ffbef"
                ),
                tx.object(
                    "0xbb4e2f4b6205c2e2a2db47aeb4f830796ec7c005f88537ee775986639bc442fe"
                ),
                tx.object(naviPools[borrowMarket].poolId),
                tx.pure(naviPools[borrowMarket].assetId),
                tx.pure(suiwithdrawAmount),
                tx.object(
                    "0xaaf735bf83ff564e1b219a0d644de894ef5bdc4b2250b126b2a46dd002331821"
                ),
                tx.object(
                    "0xf87a8acb8b81d14307894d12595541a73f19933f88e1326d5be349c7a6f7559c"
                ),
            ],
            [naviPools[borrowMarket].type]
        );

        [intmSuiCoin1] = tx.moveCall(
            "0x2::coin::from_balance",
            [intmSuiBalance1],
            [naviPools[borrowMarket].type]
        );
    } else {
        [intmSuiCoin1] = tx.moveCall(
            "0x2::coin::zero",
            [],
            [naviPools[borrowMarket].type]
        );
    }

    if (vSuiWithdrawAmount > 0) {
        const [intmVSuiBalance] = tx.moveCall(
            "0xc6374c7da60746002bfee93014aeb607e023b2d6b25c9e55a152b826dbc8c1ce::incentive_v2::withdraw",
            [
                tx.object(normalizeSuiObjectId("0x6")), // Clock
                tx.object(
                    "0x1568865ed9a0b5ec414220e8f79b3d04c77acc82358f6e5ae4635687392ffbef"
                ),
                tx.object(
                    "0xbb4e2f4b6205c2e2a2db47aeb4f830796ec7c005f88537ee775986639bc442fe"
                ),
                tx.object(naviPools[depositMarket].poolId),
                tx.pure(naviPools[depositMarket].assetId),
                tx.pure(vSuiWithdrawAmount),
                tx.object(
                    "0xaaf735bf83ff564e1b219a0d644de894ef5bdc4b2250b126b2a46dd002331821"
                ),
                tx.object(
                    "0xf87a8acb8b81d14307894d12595541a73f19933f88e1326d5be349c7a6f7559c"
                ),
            ],
            [naviPools[depositMarket].type]
        );

        const [intmVSuiCoin] = tx.moveCall(
            "0x2::coin::from_balance",
            [intmVSuiBalance],
            [naviPools[depositMarket].type]
        );

        const swappedCoin = ksdk.swapWithRoute(
            [kriyaSuiVsuiRoute],
            kriyaSuiVsuiRoute.tokenXType,
            tx.pure(vSuiWithdrawAmount),
            intmVSuiCoin,
            BigInt(Math.floor(vSuiWithdrawAmount * 0.98)),
            // @ts-ignore
            tx.txBlock
        );

        tx.mergeCoins(intmSuiCoin1, [swappedCoin]);
    }

    const [rewardCoin] = tx.moveCall(
        "0x2::coin::from_balance",
        [rewardBalance],
        [naviPools[borrowMarket].type]
    );

    // @ts-ignore
    tx.repayFlashLoan(intmSuiCoin1, loan, borrowMarket.toLowerCase());

    tx.transferObjects([rewardCoin], tx.pure(address));

    return tx.txBlock;
};
