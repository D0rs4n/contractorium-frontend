import algosdk from 'algosdk';
import * as bkr from 'beaker-ts';
export class ContractoriumPlatform extends bkr.ApplicationClient {
	desc = '';
	override methods: algosdk.ABIMethod[] = [
		new algosdk.ABIMethod({
			name: 'resign_manager',
			desc: '',
			args: [{ type: 'address', name: 'new_manager', desc: '' }],
			returns: { type: 'void', desc: '' }
		}),
		new algosdk.ABIMethod({
			name: 'set_cut',
			desc: '',
			args: [{ type: 'uint64', name: 'new_cut', desc: '' }],
			returns: { type: 'void', desc: '' }
		}),
		new algosdk.ABIMethod({
			name: 'create_bounty_program',
			desc: '',
			args: [
				{ type: 'string', name: 'name', desc: '' },
				{ type: 'string', name: 'description', desc: '' },
				{ type: 'string', name: 'image', desc: '' }
			],
			returns: { type: 'void', desc: '' }
		}),
		new algosdk.ABIMethod({
			name: 'verify_program',
			desc: '',
			args: [{ type: 'address', name: 'program', desc: '' }],
			returns: { type: '(string,string,bool,string)', desc: '' }
		}),
		new algosdk.ABIMethod({
			name: 'edit_program',
			desc: '',
			args: [
				{ type: 'string', name: 'name', desc: '' },
				{ type: 'string', name: 'description', desc: '' },
				{ type: 'string', name: 'image', desc: '' }
			],
			returns: { type: '(string,string,bool,string)', desc: '' }
		}),
		new algosdk.ABIMethod({
			name: 'create_report',
			desc: '',
			args: [
				{ type: 'address', name: 'to', desc: '' },
				{ type: 'string', name: 'title', desc: '' },
				{ type: 'string', name: 'description', desc: '' }
			],
			returns: { type: 'uint64', desc: '' }
		}),
		new algosdk.ABIMethod({
			name: 'close_and_pay_report',
			desc: '',
			args: [
				{ type: 'pay', name: 'payment', desc: '' },
				{ type: 'string', name: 'bounty_note', desc: '' }
			],
			returns: { type: 'void', desc: '' }
		}),
		new algosdk.ABIMethod({
			name: 'payday',
			desc: '',
			args: [],
			returns: { type: 'void', desc: '' }
		})
	];
	async resign_manager(
		args: {
			new_manager: string;
		},
		txnParams?: bkr.TransactionOverrides
	): Promise<bkr.ABIResult<void>> {
		const result = await this.execute(
			await this.compose.resign_manager({ new_manager: args.new_manager }, txnParams)
		);
		return new bkr.ABIResult<void>(result);
	}
	async set_cut(
		args: {
			new_cut: bigint;
		},
		txnParams?: bkr.TransactionOverrides
	): Promise<bkr.ABIResult<void>> {
		const result = await this.execute(
			await this.compose.set_cut({ new_cut: args.new_cut }, txnParams)
		);
		return new bkr.ABIResult<void>(result);
	}
	async create_bounty_program(
		args: {
			name: string;
			description: string;
			image: string;
		},
		txnParams?: bkr.TransactionOverrides
	): Promise<bkr.ABIResult<void>> {
		const result = await this.execute(
			await this.compose.create_bounty_program(
				{ name: args.name, description: args.description, image: args.image },
				txnParams
			)
		);
		return new bkr.ABIResult<void>(result);
	}
	async verify_program(
		args: {
			program: string;
		},
		txnParams?: bkr.TransactionOverrides
	): Promise<bkr.ABIResult<[string, string, boolean, string]>> {
		const result = await this.execute(
			await this.compose.verify_program({ program: args.program }, txnParams)
		);
		return new bkr.ABIResult<[string, string, boolean, string]>(
			result,
			result.returnValue as [string, string, boolean, string]
		);
	}
	async edit_program(
		args: {
			name: string;
			description: string;
			image: string;
		},
		txnParams?: bkr.TransactionOverrides
	): Promise<bkr.ABIResult<[string, string, boolean, string]>> {
		const result = await this.execute(
			await this.compose.edit_program(
				{ name: args.name, description: args.description, image: args.image },
				txnParams
			)
		);
		return new bkr.ABIResult<[string, string, boolean, string]>(
			result,
			result.returnValue as [string, string, boolean, string]
		);
	}
	async create_report(
		args: {
			to: string;
			title: string;
			description: string;
		},
		txnParams?: bkr.TransactionOverrides
	): Promise<bkr.ABIResult<bigint>> {
		const result = await this.execute(
			await this.compose.create_report(
				{ to: args.to, title: args.title, description: args.description },
				txnParams
			)
		);
		return new bkr.ABIResult<bigint>(result, result.returnValue as bigint);
	}
	async close_and_pay_report(
		args: {
			payment: algosdk.TransactionWithSigner | algosdk.Transaction;
			bounty_note: string;
		},
		txnParams?: bkr.TransactionOverrides
	): Promise<bkr.ABIResult<void>> {
		const result = await this.execute(
			await this.compose.close_and_pay_report(
				{ payment: args.payment, bounty_note: args.bounty_note },
				txnParams
			)
		);
		return new bkr.ABIResult<void>(result);
	}
	async payday(txnParams?: bkr.TransactionOverrides): Promise<bkr.ABIResult<void>> {
		const result = await this.execute(await this.compose.payday(txnParams));
		return new bkr.ABIResult<void>(result);
	}
	compose = {
		resign_manager: async (
			args: {
				new_manager: string;
			},
			txnParams?: bkr.TransactionOverrides,
			atc?: algosdk.AtomicTransactionComposer
		): Promise<algosdk.AtomicTransactionComposer> => {
			return this.addMethodCall(
				algosdk.getMethodByName(this.methods, 'resign_manager'),
				{ new_manager: args.new_manager },
				txnParams,
				atc
			);
		},
		set_cut: async (
			args: {
				new_cut: bigint;
			},
			txnParams?: bkr.TransactionOverrides,
			atc?: algosdk.AtomicTransactionComposer
		): Promise<algosdk.AtomicTransactionComposer> => {
			return this.addMethodCall(
				algosdk.getMethodByName(this.methods, 'set_cut'),
				{ new_cut: args.new_cut },
				txnParams,
				atc
			);
		},
		create_bounty_program: async (
			args: {
				name: string;
				description: string;
				image: string;
			},
			txnParams?: bkr.TransactionOverrides,
			atc?: algosdk.AtomicTransactionComposer
		): Promise<algosdk.AtomicTransactionComposer> => {
			return this.addMethodCall(
				algosdk.getMethodByName(this.methods, 'create_bounty_program'),
				{ name: args.name, description: args.description, image: args.image },
				txnParams,
				atc
			);
		},
		verify_program: async (
			args: {
				program: string;
			},
			txnParams?: bkr.TransactionOverrides,
			atc?: algosdk.AtomicTransactionComposer
		): Promise<algosdk.AtomicTransactionComposer> => {
			return this.addMethodCall(
				algosdk.getMethodByName(this.methods, 'verify_program'),
				{ program: args.program },
				txnParams,
				atc
			);
		},
		edit_program: async (
			args: {
				name: string;
				description: string;
				image: string;
			},
			txnParams?: bkr.TransactionOverrides,
			atc?: algosdk.AtomicTransactionComposer
		): Promise<algosdk.AtomicTransactionComposer> => {
			return this.addMethodCall(
				algosdk.getMethodByName(this.methods, 'edit_program'),
				{ name: args.name, description: args.description, image: args.image },
				txnParams,
				atc
			);
		},
		create_report: async (
			args: {
				to: string;
				title: string;
				description: string;
			},
			txnParams?: bkr.TransactionOverrides,
			atc?: algosdk.AtomicTransactionComposer
		): Promise<algosdk.AtomicTransactionComposer> => {
			return this.addMethodCall(
				algosdk.getMethodByName(this.methods, 'create_report'),
				{ to: args.to, title: args.title, description: args.description },
				txnParams,
				atc
			);
		},
		close_and_pay_report: async (
			args: {
				payment: algosdk.TransactionWithSigner | algosdk.Transaction;
				bounty_note: string;
			},
			txnParams?: bkr.TransactionOverrides,
			atc?: algosdk.AtomicTransactionComposer
		): Promise<algosdk.AtomicTransactionComposer> => {
			return this.addMethodCall(
				algosdk.getMethodByName(this.methods, 'close_and_pay_report'),
				{ payment: args.payment, bounty_note: args.bounty_note },
				txnParams,
				atc
			);
		},
		payday: async (
			txnParams?: bkr.TransactionOverrides,
			atc?: algosdk.AtomicTransactionComposer
		): Promise<algosdk.AtomicTransactionComposer> => {
			return this.addMethodCall(
				algosdk.getMethodByName(this.methods, 'payday'),
				{},
				txnParams,
				atc
			);
		}
	};
}
