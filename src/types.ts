
type StringMap = {
    [key: string]: string; // String keys and string values
};

interface Input {
    internalType: string;
    name: string;
    type: string;
}

interface Output {
    internalType: string;
    name: string;
    type: string;
}

interface FunctionDefinition {
    inputs: Input[];
    name: string;
    outputs: Output[];
    stateMutability: string;
    type: string;
}

type ABI = FunctionDefinition[];