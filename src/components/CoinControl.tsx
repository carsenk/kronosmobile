import React, {memo} from "react";
import PropTypes from "prop-types";
import {
	StyleSheet,
	View,
	TouchableOpacity,
	FlatList
} from "react-native";
import { systemWeights } from "react-native-typography";
import { Text, MaterialCommunityIcons } from "../styles/components";
const {
	getCoinData
} = require("../utils/networks");
const {
	getFiatBalance,
	openTxId,
	sortArrOfObjByKey,
	satsToBtc
} = require("../utils/helpers");
const {
	Constants: {
		colors
	}
} = require("../../ProjectData.json");

const _utxo = {
	tx_hash: "",
	value: 0,
	address: "",
	path: "",
	confirmations: ""
};

type UTXO = {
	tx_hash: string,
	value: number,
	address: string,
	path: string,
	confirmations: string
}

interface UtxoRowComponent {
	utxo: UTXO,
	fiatBalance: number,
	onPress: ({tx_hash: string, value: number}) => null,
	whiteListedUtxos: [string],
	blacklistedUtxos: [string],
	coinData: Object,
	selectedCrypto: string,
	cryptoUnit: string,
	fiatSymbol: string
}

const _UtxoRow = (
	{
		utxo = _utxo,
		fiatBalance = 0,
		onPress = () => null,
		whiteListedUtxos = [""],
		blacklistedUtxos = [""],
		coinData = { crypto: "", acronym: "" },
		selectedCrypto = "bitcoin",
		cryptoUnit = "satoshi",
		fiatSymbol = "$"
	}: UtxoRowComponent) => {
	try {
		const { tx_hash, value, address, path, confirmations } = utxo;
		let balance = 0;
		try {balance = cryptoUnit === "satoshi" ? value : satsToBtc({ amount: value });} catch (e) {}
		let isWhiteListed = false;
		try {isWhiteListed = whiteListedUtxos.includes(tx_hash);} catch (e) {}
		let isBlacklisted = false;
		try {isBlacklisted = blacklistedUtxos.includes(tx_hash);} catch (e) {}

		return (
			<TouchableOpacity
				activeOpacity={1}
				onPress={() => onPress({ tx_hash, value })}
			>
				{isBlacklisted &&
				<Text type="warning" style={[styles.header, { ...systemWeights.semibold, alignSelf: "center" }]}>
					UTXO Blacklisted
				</Text>}

				<View style={{ flexDirection: "row" }}>
					<View style={{ flex: 1 }}>

						<View style={styles.row}>
							<Text style={[styles.header, { fontSize: 20 }]}>
								{`${coinData["crypto"]}: `}
							</Text>
							<Text style={[styles.text, { fontSize: 18 }]}>{balance} {coinData["acronym"]}</Text>
						</View>

						<View style={[styles.row, {  marginBottom: 5 }]}>
							<Text style={[styles.header, { fontSize: 20 }]}>
								{`Fiat: `}
							</Text>
							<Text style={[styles.text, { fontSize: 18 }]}>{fiatSymbol}{fiatBalance}</Text>
						</View>

						<View style={styles.row}>
							<Text style={styles.header}>
								{"Address: "}
							</Text>
							<Text style={styles.text}>{address.substring(0, 6)}...{address.substring(address.length-6, address.length)}</Text>
						</View>

						<View style={styles.row}>
							<Text style={styles.header}>
								{"Path: "}
							</Text>
							<Text style={styles.text}>{path}</Text>
						</View>

						<View style={styles.row}>
							<Text style={styles.header}>
								{"Confirmations: "}
							</Text>
							<Text style={styles.text}>{confirmations}</Text>
						</View>

						<TouchableOpacity
							onPress={() => openTxId(tx_hash, selectedCrypto)}
							style={{ paddingVertical: 2 }}
						>
							<Text style={[styles.header, { textDecorationLine: "underline" }]}>
								View Transaction
							</Text>
						</TouchableOpacity>

					</View>
					<View style={{ flex: 0.2, justifyContent: "center", alignItems: "center" }}>
						<MaterialCommunityIcons name={isWhiteListed ? "checkbox-marked-circle" : "checkbox-blank-circle-outline"} size={30} color={colors.darkPurple} />
					</View>
				</View>
			</TouchableOpacity>
		);
	} catch (e) {}
};

const UtxoRow = memo(
	_UtxoRow,
	(prevProps, nextProps) => {
		if (!prevProps || !nextProps) return true;
		return prevProps.utxo === nextProps.utxo &&
			prevProps.fiatBalance === nextProps.fiatBalance &&
			prevProps.coinData === nextProps.coinData &&
			prevProps.selectedCrypto === nextProps.selectedCrypto &&
			prevProps.whiteListedUtxos === nextProps.whiteListedUtxos &&
			prevProps.blacklistedUtxos === nextProps.blacklistedUtxos;
	}
);

interface CoinControlComponent {
	blacklistedUtxos: [string],
	whiteListedUtxos: [string],
	whiteListedUtxosBalance: number,
	onPress: ({tx_hash: string, value: number}) => null,
	utxos: [UTXO],
	selectedCrypto: string,
	cryptoUnit: string,
	exchangeRate: number,
	fiatSymbol: string,
	style?: object,
}

const Separator = () => {
	return <View style={styles.separator} />;
};

const _CoinControl = (
	{
		blacklistedUtxos = [""],
		whiteListedUtxos = [""],
		whiteListedUtxosBalance = 0,
		onPress = () => null,
		utxos = [_utxo],
		selectedCrypto = "bitcoin",
		cryptoUnit = "satoshi",
		exchangeRate = 0,
		style = {},
		fiatSymbol = "$"
	}: CoinControlComponent) => {

	const coinData = getCoinData({selectedCrypto, cryptoUnit });

	const getAvailableToSpendText = () => {
		try {
			let balance = 0;
			try {
				balance = cryptoUnit === "satoshi" ? whiteListedUtxosBalance : satsToBtc({ amount: whiteListedUtxosBalance });
			} catch (e) {}
			return `${coinData.crypto}: ${balance} ${coinData.acronym}`;
		} catch (e) {return "BTC: 0 sats";}
	};

	//Sort utxos by confirmations.
	utxos = sortArrOfObjByKey(utxos, "confirmations");

	return (
		<View style={[styles.container, { ...style }]}>

			<Text type="text2" style={styles.coinControlText}>
				Amount available to spend:
			</Text>
			<Text type="text2" style={[styles.coinControlHeader, { marginTop: 10, marginBottom: 2 }]}>
				{getAvailableToSpendText()}
			</Text>
			<Text type="text2" style={[styles.coinControlHeader, { marginBottom: 10 }]}>
				{`Fiat: ${fiatSymbol}${getFiatBalance({ balance: whiteListedUtxosBalance, exchangeRate })}`}
			</Text>
			<Text style={[styles.coinControlText, { fontSize: 20 }]}>What coins would you like to use in this transaction?</Text>
			<View style={{ width: "100%", height: 1.5, backgroundColor: colors.darkPurple, marginVertical: 5 }} />

			<FlatList
				contentContainerStyle={{ paddingBottom: 60 }}
				data={utxos}
				extraData={whiteListedUtxosBalance}
				keyExtractor={(utxo) => `${utxo["tx_hash"]}`}
				ItemSeparatorComponent={Separator}
				renderItem={({ item: utxo }): any => {
					try {
						const fiatBalance = getFiatBalance({ balance: utxo["value"], exchangeRate });
						return (
							<UtxoRow
								coinData={coinData}
								utxo={utxo}
								fiatBalance={fiatBalance}
								onPress={onPress}
								blacklistedUtxos={blacklistedUtxos}
								whiteListedUtxos={whiteListedUtxos}
								selectedCrypto={selectedCrypto}
								cryptoUnit={cryptoUnit}
								fiatSymbol={fiatSymbol}
							/>
						);
					} catch (e) {}
				}}
			/>
		</View>
	);
};

_CoinControl.protoTypes = {
	blacklistedUtxos: PropTypes.array.isRequired,
	whiteListedUtxos: PropTypes.array.isRequired,
	whiteListedUtxosBalance: PropTypes.number.isRequired,
	onPress: PropTypes.func.isRequired,
	utxos: PropTypes.array.isRequired,
	selectedCrypto: PropTypes.string.isRequired,
	cryptoUnit: PropTypes.string.isRequired,
	exchangeRate: PropTypes.number.isRequired,
	style: PropTypes.object
};

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	header: {
		...systemWeights.thin,
		textAlign: "left",
		backgroundColor: "transparent",
		fontSize: 18,
		fontWeight: "bold"
	},
	row: {
		flexDirection: "row",
		alignItems: "flex-end"
	},
	separator: {
		width: "100%",
		height: 2,
		backgroundColor: colors.darkPurple,
		marginVertical: 15
	},
	text: {
		...systemWeights.semibold,
		textAlign: "left",
		backgroundColor: "transparent",
		fontSize: 16
	},
	coinControlText: {
		...systemWeights.regular,
		fontSize: 22,
		textAlign: "center"
	},
	coinControlHeader: {
		...systemWeights.semibold,
		textAlign: "center",
		backgroundColor: "transparent",
		fontWeight: "bold",
		fontSize: 18
	}
});

//ComponentShouldNotUpdate
const CoinControl = memo(
	_CoinControl,
	(prevProps, nextProps) => {
		if (!prevProps || !nextProps) return true;
		return (
			nextProps.whiteListedUtxosBalance === prevProps.whiteListedUtxosBalance
		);
	}
);

export default CoinControl;
