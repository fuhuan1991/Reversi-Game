const m:{ [key: string]: string; } = {
    'X': 'O',
    'O': 'X',
    'head': 'tail',
    'tail': 'head',
}
export const getRival = (player: string) => {
    return m[player];
}