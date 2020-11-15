import React, { memo } from "react";
import {
	StyleSheet,
	TouchableOpacity
} from "react-native";
import PropTypes from "prop-types";
import { systemWeights } from "react-native-typography";
import bitcoinUnits from "bitcoin-units";
import { View, Text } from "../styles/components";

const {
	Constants: {
		colors
	}
} = require("../../ProjectData.json");
const moment = require("moment");
const {
	formatNumber
} = require("../utils/helpers");

const {
	getCoinData
} = require("../utils/networks");

interface TransactionRowComponent {
	id: string,
	coin: string,
	address: string,
	amount: number,
	label: string,
	date: number,
	transactionBlockHeight: number,
	exchangeRate: number | string,
	currentBlockHeight: number,
	fiatSymbol: string,
	cryptoUnit: string,
	type: string,
	onTransactionPress: Function,
	messages: [],
	isBlacklisted: boolean
}
const _TransactionRow = (
	{
		id = "",
		coin = "bitcoin",
		address = "",
		amount = 0,
		label = "",
		date = 0,
		transactionBlockHeight = 0,
		exchangeRate = "0",
		currentBlockHeight = 0,
		fiatSymbol = "$",
		cryptoUnit = "satoshi",
		type = "received",
		onTransactionPress = () => null,
		messages = [],
		isBlacklisted = false
	}: TransactionRowComponent) => {

	const getCryptoAmountLabel = () => {
		try {
			//This prevents the view from displaying 0 BTC
			if (amount < 50000 && cryptoUnit === "BTC") {
				return `${formatNumber(Number((amount * 0.00000001).toFixed(8)))} BTC`;
			} else if (amount < 50000 && cryptoUnit === "D") {
				return `${formatNumber(Number((amount * 0.00000001).toFixed(8)))} D`;
			} else {
				return `${formatNumber(bitcoinUnits(amount, "satoshi").to(cryptoUnit).value())} ${getCoinData({selectedCrypto: coin, cryptoUnit}).acronym}`;
			}
		} catch (e) {
			console.log(e);
			return 0;
		}
	};

	const getFiatAmountLabel = () => {
		try {
			const cryptoRate = Number(exchangeRate) * 0.00000001;
			let label = (Number(amount)*cryptoRate).toFixed(2);
			label = type === "sent" ? `-${fiatSymbol}${formatNumber(Math.abs(Number(label)).toFixed(2))}` : `+${fiatSymbol}${formatNumber(label)}`;
			return label;
		} catch (e) {
			console.log(e);
			return 0;
		}
	};

	const getConfirmations = () => {
		try {
			if (transactionBlockHeight === null || currentBlockHeight === null) return "?";
			return transactionBlockHeight !== 0 ? formatNumber(Math.abs(Number(currentBlockHeight)) - (Math.abs(Number(transactionBlockHeight - 1)))) : 0;
		} catch (e) {
			console.log(e);
			return "?";
		}
	};

	const getMessages = () => {
		try {
			let message = "";
			const messageLength = messages.length;
			messages.forEach((item, i) => {
				if (i+1 === messageLength) {
					message = message.concat(`${item}`);
				} else {
					message = message.concat(`${item}\n`);
				}
			});
			return message;
		} catch (e) {
			console.log(e);
			return "";
		}
	};

	if (!address || !amount) return <View />;

	if (!label) label = address;
	if (label.length > 18) label = `${label.substr(0, 18)}...`;
	const fontWeight = type === "sent" ? "normal" : "bold";
	const textColor = "text2";
	return (
		<TouchableOpacity onPress={() => onTransactionPress(id)} style={styles.container}>
			<View type="gray3" style={styles.header}>
				{isBlacklisted &&<Text style={[styles.text, { fontWeight: "bold", fontSize: 16, color: colors.red  }]}>UTXO Blacklisted</Text>}
				<Text type="text2" style={[styles.smallText, { ...systemWeights.semibold, }]}>{moment.unix(date).format('l @ h:mm a')}</Text>
			</View>
			<View style={styles.row}>
				<View style={styles.col1}>
					<Text type={textColor} style={[styles.text, { fontWeight, fontSize: 14  }]}>{label}</Text>
					<Text type={textColor} style={[styles.smallText, { fontWeight, fontSize: 14  }]}>Confirmations: {getConfirmations()}</Text>
				</View>
				<View style={styles.col2}>
					<Text type={textColor} style={[styles.text, { fontWeight }]}>{getFiatAmountLabel()}</Text>
					<Text type={textColor} style={[styles.text, { fontWeight  }]}>{type === "received" ? "+" : "-"}{getCryptoAmountLabel()}</Text>
				</View>
			</View>
			{messages.length > 0 &&
			<View style={styles.row}>
				<View style={[styles.col1, { flex: 0.6 }]}>
					<Text type={textColor} style={[styles.text, { fontWeight, fontSize: 16  }]}>Message:</Text>
				</View>
				<View style={[styles.col2, { flex: 1 }]}>
					<Text type={textColor} style={[styles.text, { fontWeight }]}>{getMessages()}</Text>
				</View>
			</View>}
		</TouchableOpacity>
	);
};

_TransactionRow.propTypes = {
	id: PropTypes.string,
	coin: PropTypes.string.isRequired,
	address: PropTypes.string,
	amount: PropTypes.number.isRequired,
	label: PropTypes.string,
	date: PropTypes.number,
	transactionBlockHeight: PropTypes.number.isRequired,
	exchangeRate: PropTypes.string.isRequired,
	currentBlockHeight: PropTypes.number.isRequired,
	cryptoUnit: PropTypes.string.isRequired,
	type: PropTypes.string.isRequired,
	onTransactionPress: PropTypes.func.isRequired,
	messages: PropTypes.arrayOf(PropTypes.string).isRequired
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "transparent"
	},
	header: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 2,
		paddingHorizontal: 10
	},
	row: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		paddingBottom: 8,
		paddingTop: 2
	},
	col1: {
		flex: 1,
		alignItems: "flex-start",
		justifyContent: "center",
		paddingLeft: 10
	},
	col2: {
		flex: 0.9,
		alignItems: "flex-end",
		justifyContent: "center",
		paddingRight: 10
	},
	text: {
		...systemWeights.light,
		fontSize: 16,
		textAlign: "center"
	},
	smallText: {
		...systemWeights.thin,
		fontSize: 14,
		textAlign: "center"
	}
});

//ComponentShouldNotUpdate
const TransactionRow = memo(
	_TransactionRow,
	(prevProps, nextProps) => {
		if (!prevProps || !nextProps) return true;
		return nextProps === prevProps;
	}
);
export default TransactionRow;
