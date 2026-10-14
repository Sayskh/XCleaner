export const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

// Timeline envelope depth differs per operation (timeline_v2 vs nested timeline).
// Find the instructions array instead of hardcoding one path.
export function findInstructions(root, maxDepth = 6) {
  const walk = (node, depth) => {
    if (!node || typeof node !== 'object' || depth > maxDepth) return null;
    if (Array.isArray(node.instructions)) return node.instructions;
    for (const key of Object.keys(node)) {
      const found = walk(node[key], depth + 1);
      if (found) return found;
    }
    return null;
  };
  return walk(root, 0) || [];
}
