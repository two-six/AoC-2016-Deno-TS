enum Direction {
  NORTH,
  EAST,
  SOUTH,
  WEST 
}

interface Position {
  x: number,
  y: number,
  face: Direction
}

const readData = (filename: string): string[] => {
  return Deno.readTextFileSync(filename)
    .split(', '); 
}

const step = (instruction: string, pos: Position, visited: Set<string>):
  {pos: Position, visited: Set<string>, gold: number} =>  {
    let gold = 0;
    const moveFace = (dir: string) => {
        if(dir === 'L') {
            pos.face -= 1;
            if(pos.face < 0) 
                pos.face = 3;
        } else {
            pos.face += 1;
            if(pos.face > 3) 
                pos.face = 0;
        }
    }; 

    const move = (value: string) => {
        let vis = false;
        for(let i=1; i <= parseInt(value); i++) {
            const nx = pos.x + (pos.face%2==0 ? 0 : pos.face==1 ? i : -i);
            const ny = pos.y + (pos.face%2==1 ? 0 : pos.face==2 ? i : -i);
            if(visited.has([nx, ny].toString()) && !vis) {
                gold = Math.abs(nx) + Math.abs(ny);
                vis = true;
            }
            visited.add([nx, ny].toString());
        }
        switch(pos.face) {
            case Direction.NORTH:
                pos.y -= parseInt(value);
                break;
            case Direction.EAST:
                pos.x += parseInt(value);
                break;
            case Direction.SOUTH:
                pos.y += parseInt(value);
                break;
            case Direction.WEST:
                pos.x -= parseInt(value);
                break;
        }
    };

    moveFace(instruction.substring(0, 1));
    move(instruction.substring(1));
    return {
        pos: pos,
        visited: visited,
        gold: gold
    };
}

const data = readData('./input.txt');

let pos: Position = {
  x: 0,
  y: 0,
  face: Direction.NORTH
};

let vis = false;

let visited = new Set([[0, 0].toString()]);
for(const d in data) {
  const res = step(data[d], pos, visited);
  pos = res.pos;
  visited = res.visited;
  if(res.gold != 0 && !vis) {
    vis = true;
    console.log('Gold:', res.gold);
  }
}

console.log('Silver:', Math.abs(pos.x) + Math.abs(pos.y));