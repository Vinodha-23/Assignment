// function visualizeWater() {
//   const inputBox = document.getElementById("heights");
//   const input = inputBox.value;
//   const svg = document.getElementById("svg-output");
//   const waterCounter = document.getElementById("water-count");
//   const resultCard = document.getElementById("result");

//   inputBox.classList.remove("error");

//   let heights = input.trim().split(",").map(n => parseInt(n.trim(), 10));
//   if (heights.some(isNaN)) {
//       inputBox.classList.add("error");
//       // alert("⚠️ Please enter valid comma-separated numbers.");
//       return;
//   }

//   const { totalWater, grid, water } = computeWaterBlocks(heights);
//   waterCounter.textContent = totalWater;
//   resultCard.style.display = "block";

//   const defs = svg.querySelector("defs");
//   svg.innerHTML = "";
//   if (defs) svg.appendChild(defs);

//   const cellSize = 30;
//   const rows = grid.length;
//   const cols = grid[0].length;

//   svg.setAttribute("width", cols * cellSize);
//   svg.setAttribute("height", rows * cellSize);

//   for (let y = 0; y < rows; y++) {
//       for (let x = 0; x < cols; x++) {
//           const type = grid[y][x];
//           const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
//           rect.setAttribute("x", x * cellSize);
//           rect.setAttribute("y", y * cellSize);
//           rect.setAttribute("width", cellSize);
//           rect.setAttribute("height", cellSize);

//           if (type === "wall") {
//               rect.setAttribute("class", "building");
//           } else if (type === "water") {
//               rect.setAttribute("class", "water");
//               rect.setAttribute("fill", "url(#waterGradient)");
//               rect.style.animationDelay = `${(rows - y) * 30}ms`;
//           } else {
//               rect.setAttribute("fill", "transparent");
//           }

//           svg.appendChild(rect);
//       }
//   }

//   const maxWater = Math.max(...water);
//   const maxColIndex = water.indexOf(maxWater);
//   const totalDelay = (rows * 30) + 300;

//   setTimeout(() => {
//       const rects = svg.querySelectorAll("rect");
//       rects.forEach(rect => {
//           const x = parseInt(rect.getAttribute("x"));
//           const col = x / cellSize;
//           if (col === maxColIndex && rect.classList.contains("water")) {
//               rect.classList.add("highlighted");
//           }
//       });
//   }, totalDelay);
// }

// function computeWaterBlocks(heights) {
//   const n = heights.length;
//   const leftMax = new Array(n).fill(0);
//   const rightMax = new Array(n).fill(0);
//   const water = new Array(n).fill(0);

//   leftMax[0] = heights[0];
//   for (let i = 1; i < n; i++) {
//       leftMax[i] = Math.max(leftMax[i - 1], heights[i]);
//   }

//   rightMax[n - 1] = heights[n - 1];
//   for (let i = n - 2; i >= 0; i--) {
//       rightMax[i] = Math.max(rightMax[i + 1], heights[i]);
//   }

//   let totalWater = 0;
//   for (let i = 0; i < n; i++) {
//       water[i] = Math.max(0, Math.min(leftMax[i], rightMax[i]) - heights[i]);
//       totalWater += water[i];
//   }

//   const maxHeight = Math.max(...heights.map((h, i) => h + water[i]));
//   const grid = [];

//   for (let level = maxHeight - 1; level >= 0; level--) {
//       const row = [];
//       for (let i = 0; i < n; i++) {
//           if (level < heights[i]) {
//               row.push("wall");
//           } else if (level < heights[i] + water[i]) {
//               row.push("water");
//           } else {
//               row.push("empty");
//           }
//       }
//       grid.push(row);
//   }

//   return { totalWater, grid, water };
// }

// function reset() {
//   const svg = document.getElementById("svg-output");
//   const defs = svg.querySelector("defs");
//   svg.innerHTML = '';
//   if (defs) svg.appendChild(defs);

//   document.getElementById("heights").value = "";
//   document.getElementById("water-count").textContent = "0";
//   document.getElementById("result").style.display = "none";

//   document.getElementById("heights").classList.remove("error");
// }

// document.getElementById("heights").addEventListener("keydown", function (e) {
//   if (e.key === "Enter") {
//       visualizeWater();
//   }
// });


function visualizeWater() {
  const inputBox = document.getElementById("heights");
  const input = inputBox.value;
  const svg = document.getElementById("svg-output");
  const waterCounter = document.getElementById("water-count");
  const resultCard = document.getElementById("result");

  // Reset error styling
  inputBox.classList.remove("error");

  // Parse and validate
  let heights = input.trim().split(",").map(n => parseInt(n.trim(), 10));
  if (heights.some(isNaN)) {
      inputBox.classList.add("error");
      alert("⚠️ Please enter valid comma-separated numbers.");
      return;
  }

  const { totalWater, grid, water } = computeWaterBlocks(heights);
  waterCounter.textContent = totalWater;
  resultCard.style.display = "block";

  // Preserve <defs>
  const defs = svg.querySelector("defs");
  svg.innerHTML = "";
  if (defs) svg.appendChild(defs);

  const cellSize = 30;
  const rows = grid.length;
  const cols = grid[0].length;

  svg.setAttribute("width", cols * cellSize);
  svg.setAttribute("height", rows * cellSize);

  for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
          const type = grid[y][x];
          const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
          rect.setAttribute("x", x * cellSize);
          rect.setAttribute("y", y * cellSize);
          rect.setAttribute("width", cellSize);
          rect.setAttribute("height", cellSize);

          if (type === "wall") {
              rect.setAttribute("class", "building");
          } else if (type === "water") {
              rect.setAttribute("class", "water");
              rect.setAttribute("fill", "url(#waterGradient)");
              rect.style.animationDelay = `${(rows - y) * 30}ms`;
          } else {
              rect.setAttribute("fill", "transparent");
          }

          svg.appendChild(rect);
      }
  }

  // ✅ Highlight max water column after animation
  const maxWater = Math.max(...water);
  const maxColIndex = water.indexOf(maxWater);
  const totalDelay = (rows * 30) + 300;

  setTimeout(() => {
      const rects = svg.querySelectorAll("rect");
      rects.forEach(rect => {
          const x = parseInt(rect.getAttribute("x"));
          const col = x / cellSize;
          if (col === maxColIndex && rect.classList.contains("water")) {
              rect.classList.add("highlighted");
          }
      });
  }, totalDelay);
  // Highlight the water counter visually
setTimeout(() => {
  const counter = document.querySelector(".water-counter");
  counter.classList.add("highlighted");
  setTimeout(() => counter.classList.remove("highlighted"), 2400);
}, totalDelay + 150);

}

function computeWaterBlocks(heights) {
  const n = heights.length;
  const leftMax = new Array(n).fill(0);
  const rightMax = new Array(n).fill(0);
  const water = new Array(n).fill(0);

  leftMax[0] = heights[0];
  for (let i = 1; i < n; i++) {
      leftMax[i] = Math.max(leftMax[i - 1], heights[i]);
  }

  rightMax[n - 1] = heights[n - 1];
  for (let i = n - 2; i >= 0; i--) {
      rightMax[i] = Math.max(rightMax[i + 1], heights[i]);
  }

  let totalWater = 0;
  for (let i = 0; i < n; i++) {
      water[i] = Math.max(0, Math.min(leftMax[i], rightMax[i]) - heights[i]);
      totalWater += water[i];
  }

  const maxHeight = Math.max(...heights.map((h, i) => h + water[i]));
  const grid = [];

  for (let level = maxHeight - 1; level >= 0; level--) {
      const row = [];
      for (let i = 0; i < n; i++) {
          if (level < heights[i]) {
              row.push("wall");
          } else if (level < heights[i] + water[i]) {
              row.push("water");
          } else {
              row.push("empty");
          }
      }
      grid.push(row);
  }

  return { totalWater, grid, water };
}

function reset() {
  const svg = document.getElementById("svg-output");
  const defs = svg.querySelector("defs");
  svg.innerHTML = '';
  if (defs) svg.appendChild(defs);

  document.getElementById("heights").value = "";
  document.getElementById("water-count").textContent = "0";
  document.getElementById("result").style.display = "none";

  document.getElementById("heights").classList.remove("error");
}

// ✅ Trigger visualize on Enter key
document.getElementById("heights").addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
      visualizeWater();
  }
});
