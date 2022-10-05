export default {
	_format: 'hh-sol-artifact-1',
	contractName: 'IDiamondCut',
	sourceName: 'contracts/facets/interfaces/IDiamondCut.sol',
	abi: [
		{
			anonymous: false,
			inputs: [
				{
					components: [
						{
							internalType: 'address',
							name: 'facetAddress',
							type: 'address'
						},
						{
							internalType: 'enum IDiamondCut.FacetCutAction',
							name: 'action',
							type: 'uint8'
						},
						{
							internalType: 'bytes4[]',
							name: 'functionSelectors',
							type: 'bytes4[]'
						}
					],
					indexed: false,
					internalType: 'struct IDiamondCut.FacetCut[]',
					name: '_diamondCut',
					type: 'tuple[]'
				},
				{
					indexed: false,
					internalType: 'address',
					name: '_init',
					type: 'address'
				},
				{
					indexed: false,
					internalType: 'bytes',
					name: '_calldata',
					type: 'bytes'
				}
			],
			name: 'DiamondCut',
			type: 'event'
		},
		{
			inputs: [
				{
					components: [
						{
							internalType: 'address',
							name: 'facetAddress',
							type: 'address'
						},
						{
							internalType: 'enum IDiamondCut.FacetCutAction',
							name: 'action',
							type: 'uint8'
						},
						{
							internalType: 'bytes4[]',
							name: 'functionSelectors',
							type: 'bytes4[]'
						}
					],
					internalType: 'struct IDiamondCut.FacetCut[]',
					name: '_diamondCut',
					type: 'tuple[]'
				},
				{
					internalType: 'address',
					name: '_init',
					type: 'address'
				},
				{
					internalType: 'bytes',
					name: '_calldata',
					type: 'bytes'
				}
			],
			name: 'diamondCut',
			outputs: [],
			stateMutability: 'nonpayable',
			type: 'function'
		}
	],
	bytecode: '0x',
	deployedBytecode: '0x',
	linkReferences: {},
	deployedLinkReferences: {}
}
