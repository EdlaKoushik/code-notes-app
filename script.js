const fileSystem = {
  "java-dsa": {
    "stacks": {
      "stock-span-problem.java": `public class StockSpan {
  public static void main(String[] args) {
    int[] prices = {100, 80, 60, 70, 60, 75, 85};
    int[] span = new int[prices.length];
    span[0] = 1;
    for (int i = 1; i < prices.length; i++) {
      int count = 1;
      while (i - count >= 0 && prices[i] >= prices[i - count]) {
        count += span[i - count];
      }
      span[i] = count;
    }
    for (int s : span) System.out.print(s + " ");
  }
}`
    }
  }
};

function renderSidebar(fs, parent = "", container = document.getElementById("sidebar")) {
  for (const key in fs) {
    const item = document.createElement("div");
    if (typeof fs[key] === "string") {
      item.className = "file";
      item.textContent = key;
      item.onclick = () => displayFile(`${parent}/${key}`, fs[key]);
    } else {
      item.className = "folder";
      item.textContent = key;
      container.appendChild(item);
      renderSidebar(fs[key], `${parent}/${key}`, container);
    }
    container.appendChild(item);
  }
}

function displayFile(path, content) {
  document.getElementById("filePath").textContent = path;
  const codeBlock = document.getElementById("codeDisplay");
  codeBlock.textContent = content;
  Prism.highlightElement(codeBlock);
}

renderSidebar(fileSystem);
