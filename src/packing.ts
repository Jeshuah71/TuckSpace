export type PackingItem = {
    id:number;
    name: string;
    width: number;
    height: number;
};

export type PlacedItem = PackingItem & {
    x: number;
    y: number;
};

export type PackagingContainer = {
    width: number;
    height: number;
};

// Our available packing space
export const container: PackagingContainer = {
    width: 10,
    height: 6,
};

// Objects we want to pack 
export const items: PackingItem[] = [
    {
        id: 1,
        name: "Box A",
        width: 4,
        height: 3,
    },
    {
        id: 2,
        name: "Box B",
        width: 3,
        height: 2,
    },
    {
        id: 3,
        name: "Box C",
        width: 5,
        height: 2,
    },
    {
        id: 4,
        name: "Box D",
        width: 2,
        height: 2
    },
];

export function calculateArea(
    width: number,
    height: number
) : number {
    const area = width * height;
    return area
}

export function packItems(
    items: PackingItem[],
    container: PackagingContainer
): {
    placed: PlacedItem[];
    unplaced: PackingItem[];
} {
    const placed: PlacedItem[] = [];
    const unplaced: PackingItem[] =[];

    let x = 0;
    let y = 0;
    let rowHeight = 0;

    for (const item of items) {
        //Reject invalid or oversized items
        if (
            item.width <= 0 ||  
            item.height <= 0 ||
            item.width > container.width || 
            item.height > container.height
        ) {
            unplaced.push(item);
            continue;
        }

        // Start a new row when horizontal space runs out 
        if (x + item.width > container.width) {
            x = 0;
            y += rowHeight;
            rowHeight = 0;
        }

        //Check whether the item fits vertically
        if (y + item.height > container.height) {
            unplaced.push(item);
            continue;
        }

        // Save the item's postion
        placed.push({
            ...item,
            x: x,
            y: y,
        });

        // Move right for the next item
        x += item.width;

        // Keep track of the tallest item in this row
        rowHeight = Math.max(rowHeight, item.height);
    }

    return {placed, unplaced};
}

export function optimizePacking(
  items: PackingItem[],
  container: PackagingContainer
) {
  // Try different ways of ordering the boxes
  const strategies = [
    items,

    [...items].sort(
      (a, b) =>
        calculateArea(b.width, b.height) -
        calculateArea(a.width, a.height)
    ),

    [...items].sort(
      (a, b) => b.width - a.width
    ),
  ];

  // Start with the original arrangement
  let bestResult = packItems(items, container);
  let bestArea = bestResult.placed.reduce(
    (total, item) =>
      total + calculateArea(item.width, item.height),
    0
  );

  for (const strategy of strategies) {
    const result = packItems(strategy, container);

    const area = result.placed.reduce(
      (total, item) =>
        total + calculateArea(item.width, item.height),
      0
    );

    // Keep the arrangement with more packed area
    if (area > bestArea) {
      bestResult = result;
      bestArea = area;
    }
  }

  return bestResult;
}

