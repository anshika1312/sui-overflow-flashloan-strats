import { Scallop } from "@scallop-io/sui-scallop-sdk";
import { Dex } from "kriya-dex-sdk";

const RPC = "https://fullnode.mainnet.sui.io:443";

const scallopSDK = new Scallop({
    networkType: "mainnet",
});

const kriyaSuiAfSuiRoute = {
    objectId:
        "0xc0d598bcad669ac1a9b0af255de259c46092b495cdd6c26f2cb38bb23d8b4357",
    tokenYType:
        "0x0000000000000000000000000000000000000000000000000000000000000002::sui::SUI",
    tokenXType:
        "0xf325ce1300e8dac124071d3152c5c5ee6174914f8bc2161e88329cf579246efc::afsui::AFSUI",
};

export const leverageSuiAfSui = async (
    flashLoanAmount: number,
    amount: number,
    sender: string,
    okId?: string,
    obligationId?: string
) => {
    const builder = await scallopSDK.createScallopBuilder();
    const kriya = new Dex(RPC);

    const tx = builder.createTxBlock();

    let obligationKey;
    let obligation;
    let hotPotato;

    if (!okId) {
        [obligation, obligationKey, hotPotato] = tx.openObligation();
    } else {
        obligation = tx.object(obligationId);
        obligationKey = tx.object(okId);
    }

    await tx.updateAssetPricesQuick([
        "eth",
        "usdc",
        "usdt",
        "sui",
        "cetus",
        "afsui",
        "hasui",
        "vsui",
    ]);

    let initCoin;
    let loan;

    if (flashLoanAmount > 100000) {
        [initCoin, loan] = tx.borrowFlashLoan(tx.pure(flashLoanAmount), "sui");
    }

    if (amount > 0) {
        if (flashLoanAmount > 100000) {
            const [suiCoin] = tx.splitCoins(tx.gas, [tx.pure(amount)]);
            tx.mergeCoins(initCoin, [suiCoin]);
        } else {
            [initCoin] = tx.splitCoins(tx.gas, [tx.pure(amount)]);
        }
    }

    let afSuiCoin;

    if (amount + flashLoanAmount <= 1e9) {
        afSuiCoin = kriya.swapWithRoute(
            [kriyaSuiAfSuiRoute],
            kriyaSuiAfSuiRoute.tokenYType,
            tx.pure(
                flashLoanAmount > 100000 ? +flashLoanAmount + amount : amount
            ),
            // @ts-ignore
            initCoin,
            BigInt(
                Math.floor(
                    (flashLoanAmount > 100000
                        ? +flashLoanAmount + amount
                        : amount) * 0.95
                )
            ),
            // @ts-ignore
            tx.txBlock
        );
    } else {
        [afSuiCoin] = tx.moveCall(
            "0x7f6ce7ade63857c4fd16ef7783fed2dfc4d7fb7e40615abdb653030b76aef0c6::staked_sui_vault::request_stake",
            [
                tx.object(
                    "0x2f8f6d5da7f13ea37daa397724280483ed062769813b6f31e9788e59cc88994d"
                ),
                tx.object(
                    "0xeb685899830dd5837b47007809c76d91a098d52aabbf61e8ac467c59e5cc4610"
                ),
                tx.object(
                    "0x0000000000000000000000000000000000000000000000000000000000000005"
                ),
                tx.object(
                    "0x4ce9a19b594599536c53edb25d22532f82f18038dc8ef618afd00fbbfb9845ef"
                ),
                initCoin,
                tx.pure(
                    "0xd30018ec3f5ff1a3c75656abf927a87d7f0529e6dc89c7ddd1bd27ecb05e3db2"
                ),
            ]
        );
    }

    tx.unstakeObligation(obligation, obligationKey);

    // @ts-ignore
    tx.addCollateral(obligation, afSuiCoin, "afsui");

    if (flashLoanAmount > 100000) {
        const borrowedSui = tx.borrow(
            obligation,
            obligationKey,
            tx.pure(Math.floor(flashLoanAmount * 1.005)),
            "sui"
        );

        const [repayCoin] = tx.splitCoins(borrowedSui, [
            tx.pure(flashLoanAmount),
        ]);

        // @ts-ignore
        tx.repayFlashLoan(repayCoin, loan, "sui");

        tx.transferObjects([borrowedSui], tx.pure(sender));
    }

    tx.stakeObligation(obligation, obligationKey);

    if (!okId) {
        // @ts-ignore
        tx.returnObligation(obligation, hotPotato);
        tx.transferObjects([obligationKey], sender);
    }

    return tx.txBlock;
};

export const deleverageSuiAfSui = async (
    obligationId: string,
    flashLoanAmount: number,
    okId: string,
    sender: string
) => {
    const builder = await scallopSDK.createScallopBuilder();
    const kriya = new Dex(RPC);

    const tx = builder.createTxBlock();

    await tx.updateAssetPricesQuick([
        "eth",
        "usdc",
        "usdt",
        "sui",
        "cetus",
        "afsui",
        "hasui",
        "vsui",
    ]);

    // Borrow flash loan

    let [initCoin, loan] = tx.borrowFlashLoan(tx.pure(flashLoanAmount), "sui");

    // Unstake obligation

    tx.unstakeObligation(tx.object(obligationId), tx.object(okId));

    // Repay borrowed SUI

    tx.repay(tx.object(obligationId), initCoin, "sui");

    // Withdraw afsui collateral =  repayed sui

    const withdrawnAfSui = tx.takeCollateral(
        tx.object(obligationId),
        tx.object(okId),
        tx.pure(Math.floor(flashLoanAmount)),
        "afsui"
    );

    // Swap afsui to sui

    const [swappedSuiCoin] = tx.moveCall(
        `0xefe170ec0be4d762196bedecd7a065816576198a6527c99282a2551aaa7da38c::swap::swap_exact_in`,
        [
            tx.object(
                "0x97aae7a80abb29c9feabbe7075028550230401ffe7fb745757d3c28a30437408"
            ),
            tx.object(
                "0xfcc774493db2c45c79f688f88d28023a3e7d98e4ee9f48bbf5c7990f651577ae"
            ),
            tx.object(
                "0xf194d9b1bcad972e45a7dd67dd49b3ee1e3357a00a50850c52cd51bb450e13b4"
            ),
            tx.object(
                "0x28e499dff5e864a2eafe476269a4f5035f1c16f338da7be18b103499abf271ce"
            ),
            tx.object(
                "0xf0c40d67b078000e18032334c3325c47b9ec9f3d9ae4128be820d54663d14e3b"
            ),
            tx.object(
                "0x35d35b0e5b177593d8c3a801462485572fc30861e6ce96a55af6dc4730709278"
            ),
            withdrawnAfSui,
            tx.pure(flashLoanAmount),
            tx.pure(flashLoanAmount),
        ],
        [
            "0x42d0b3476bc10d18732141a471d7ad3aa588a6fb4ba8e1a6608a4a7b78e171bf::af_lp::AF_LP",
            "0xf325ce1300e8dac124071d3152c5c5ee6174914f8bc2161e88329cf579246efc::afsui::AFSUI",
            "0x2::sui::SUI",
        ]
    );

    // Repay flash loan

    const [repayCoin] = tx.splitCoins(swappedSuiCoin, [
        tx.pure(flashLoanAmount),
    ]);

    tx.repayFlashLoan(repayCoin, loan, "sui");

    // Stake obligation

    tx.stakeObligation(tx.object(obligationId), tx.object(okId));

    tx.transferObjects([swappedSuiCoin], tx.pure(sender));

    return tx.txBlock;
};
