window.onload = function() {
	let canvas = document.getElementById("minesweeperWindow");
	const ctx = canvas.getContext("2d");
	const width = canvas.width = 500;
	const height = canvas.height = 500;

    let area = 500*500;
    let boxCount = 100;
    let boxArea = area/boxCount;
    let boxSideLength = Math.sqrt(boxArea);
    let grid = [];
    let mineCount = 25;

    ctx.font = '40px serif';

    class Box {
        constructor(x, y, index, mine) {
            this.x = x;
            this.y = y;
            this.index = index;
            this.mine = mine || false;
            this.nearby;
            this.label;
        }

        draw() {
            ctx.beginPath();
            ctx.lineWidth = "1";
            ctx.rect(this.x,this.y,boxSideLength,boxSideLength);
            ctx.stroke();
        }

        label(l) {
            this.label = l || "";

            ctx.fillStyle = "black";

            ctx.beginPath();
            ctx.fillText(this.label, this.x + 15, this.y + 37);
        }

        mask() {
            ctx.beginPath();
            ctx.fillStyle = "lightgray";
            ctx.fillRect(this.x+1,this.y+1,boxSideLength-2,boxSideLength-2);
            ctx.stroke();
        }

        removeMask() {
            ctx.clearRect(this.x+1,this.y+1,boxSideLength-2,boxSideLength-2);

            if (this.mine) {
                ctx.beginPath();
                ctx.fillStyle = "red";
                ctx.fillRect(this.x+1,this.y+1,boxSideLength-2,boxSideLength-2);
                ctx.stroke();
            } else {
                this.label(this.nearby);
            }
        }

        setMine(mine) {
            this.mine = mine;
        }
    }

    const initGrid = () => {
        let count = 0;
        for(let y = 0; y < width; y+=boxSideLength) {
            for (let x = 0; x < height; x+=boxSideLength) {
                let b = new Box(x,y,count);
                grid.push(b);
                b.draw();
                
                count++; 
            }
        }

       generateMines();
       findAndLabelAllNearby();
    }

    const generateMines = () => {
        for (let i = 0; i < mineCount; i++) {
            let rIndex = Math.floor(Math.random() * grid.length);
            if (grid[rIndex].mine == false) {
                grid[rIndex].setMine(true);
                console.log("index: " + rIndex + " is a mine.");
            } else {
                console.log("found a mine at " + rIndex);
                i--;
            }
        }
    }

    const findAndLabelAllNearby = () => {
        grid.forEach(b => {
            if (!b.mine) {
                let row = b.y / boxSideLength;
                let col = b.x / boxSideLength;
                let nearby = 0;

                if (row == 0) { // top wall
                    nearby += getMinesSame(row,col) + getMinesBelow(row,col);
                } else if (row >= height/boxSideLength-1) { // bottom
                    nearby += getMinesAbove(row,col) + getMinesSame(row,col);
                } else { // not top or bottom
                    nearby += getMinesAbove(row,col) + getMinesSame(row,col) + getMinesBelow(row,col);
                }

                b.nearby = nearby;
            }

            b.mask();
        });
    }

    const getMinesAbove = (row, col) => {
        let nearby = 0;
        let i = (col == 0) ? 0 : -1;
        let limit = (col >= width/boxSideLength-1) ? 0 : 1;

        for (i; i <= limit; i++) {
            if (grid[rowColToIndex(row-1, col+i)].mine) {
                nearby++;
            }
        }

        return nearby;
    }

    const getMinesBelow = (row, col) => {
        let nearby = 0;
        let i = (col == 0) ? 0 : -1;
        let limit = (col >= width/boxSideLength-1) ? 0 : 1;

        for (i; i <= limit; i++) {
            if (grid[rowColToIndex(row+1, col+i)].mine) {
                nearby++;
            }
        }

        return nearby;
    }

    const getMinesSame = (row, col) => {
        let nearby = 0;
        let i = (col == 0) ? 0 : -1;
        let limit = (col >= width/boxSideLength-1) ? 0 : 1;

        for (i; i <= limit; i++) {
            if (i != 0) {
                if (grid[rowColToIndex(row, col+i)].mine) {
                    nearby++;
                }
            }
        }

        return nearby;
    }

    const rowColToIndex = (row, col) => {
        return parseInt(row + "" + col); // clever huh?
    }

    initGrid();

    // enable clicking
    // enable mask removal of one tile
    // enable mask removal of multiple tiles if 0 is between them

    //removeMask quick testing
    grid[0].removeMask();
    grid[4].removeMask();
    grid[12].removeMask();
    grid[15].removeMask();
    grid[56].removeMask();
}