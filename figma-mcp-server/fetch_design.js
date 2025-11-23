import fetch from "node-fetch";

const FIGMA_ACCESS_TOKEN = "REDACTED_FIGMA_TOKEN";
const FILE_KEY = "jh5Xm4JLImD0NEnB9oyl2Z";
const NODE_ID = "1-7139";

async function main() {
    const response = await fetch(`https://api.figma.com/v1/files/${FILE_KEY}/nodes?ids=${NODE_ID}`, {
        headers: {
            "X-Figma-Token": FIGMA_ACCESS_TOKEN,
        },
    });

    if (!response.ok) {
        console.error(`Error: ${response.status} ${response.statusText}`);
        process.exit(1);
    }

    const data = await response.json();
    const nodeIdKey = NODE_ID.replace('-', ':');
    const node = data.nodes[nodeIdKey].document;

    console.log(`Node Name: ${node.name}`);
    console.log(`Background Color: ${JSON.stringify(node.backgroundColor)}`);
    console.log(`Fills: ${JSON.stringify(node.fills)}`);
    console.log(`Effects: ${JSON.stringify(node.effects)}`);

    if (node.children) {
        console.log("\nChildren:");
        node.children.forEach(child => {
            console.log(`- Name: ${child.name}, Type: ${child.type}`);
            if (child.fills) console.log(`  Fills: ${JSON.stringify(child.fills)}`);
            if (child.absoluteBoundingBox) console.log(`  BBox: ${JSON.stringify(child.absoluteBoundingBox)}`);
        });
    }
}

main();
