class Board
{
    constructor()
    {
        this.board = [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0]
        ];
        
        let players = ["pc", "human"];
        let rand = Math.round(Math.random(1));
        
        this.turn = players[rand];
        this.winner = null;
        this.winnerIndices = [];
        this.left = 9;
        this.lastPlayed = [];
    }
    
    show()
    {
        if (this.winner != null && this.winner != "tie")
        {
            stroke(0, 255, 0);
            strokeWeight(5);
            let ib = (this.winnerIndices[0][1] * 100) + 50;
            let jb = (this.winnerIndices[0][0] * 100) + 50;
            
            let ie = (this.winnerIndices[1][1] * 100) + 50;
            let je = (this.winnerIndices[1][0] * 100) + 50;
            
            line(ib, jb, ie, je);
        }
    
        stroke(0);
        strokeWeight(5);
        line(100, 10, 100, 290);
        line(200, 10, 200, 290);
        line(10, 100, 290, 100);
        line(10, 200, 290, 200);
        
        strokeWeight(4);
        for (let y=0; y<3; y++)
        {
            for(let x=0; x<3; x++)
            {
                if (this.board[x][y] == 1)
                {
                    let ib = (y * 100) + 30;
                    let jb = (x * 100) + 30;
                
                    let ie = ((y+1)*100) - 30;
                    let je = ((x+1)*100) - 30;
                    line(ib, jb, ie, je);
                    
                    ib = (y * 100) + 30;
                    jb = ((x+1)*100) - 30;
                    
                    ie = ((y+1)*100) - 30;
                    je = (x * 100) + 30;
                    
                    line(ib, jb, ie, je);
                }
                
                if (this.board[x][y] == -1)
                {
                    let i = (y * 100) + 30;
                    let j = (x * 100) + 30;
                    ellipseMode(CORNER);
                    
                    ellipse(i, j, 40, 40);
                }
            }
        }
    }
    
    play(x, y)
    {
        if (this.winner != null)
        {
            return 0;
        }
        
        if (this.board[x][y] == 0)
        {
            if (this.turn == "pc")
            {
                this.board[x][y] = -1;
                this.turn = "human";
            }
            else
            {
                this.board[x][y] = 1;
                this.turn = "pc";
            }
            
            this.left--;
            this.lastPlayed = [x, y];
        }
        
        this.checkWinner();
    }
    
    checkWinner()
    {
        let winner = this.winner;
        
        if (winner != null)
        {
            return this.winner;
        }
        
        for (let i=0; i<3; i++)
        {
            if (this.allEqual(this.board[i][0], this.board[i][1], this.board[i][2]))
            {
                winner = this.board[i][0];
                this.winnerIndices.push([i, 0]);
                this.winnerIndices.push([i, 2]);
            }
            
            if (this.allEqual(this.board[0][i], this.board[1][i], this.board[2][i]))
            {
                winner = this.board[0][i];
                this.winnerIndices.push([0, i]);
                this.winnerIndices.push([2, i]);
            }
        }
        
        if (this.allEqual(this.board[0][0], this.board[1][1], this.board[2][2]))
        {
            winner = this.board[0][0];
            this.winnerIndices.push([0, 0]);
            this.winnerIndices.push([2, 2]);
        }
        else if(this.allEqual(this.board[0][2], this.board[1][1], this.board[2][0]))
        {
            winner = this.board[0][2];
            this.winnerIndices.push([0, 2]);
            this.winnerIndices.push([2, 0]);
        }
        
        if (winner == 1)
        {
            this.winner = "human";
        }
        else if (winner == -1)
        {
            this.winner = "pc";
        }
        else if (winner==null && this.left==0)
        {
            this.winner = "tie";
        }
        
        return this.winner;
    }
    
    allEqual(a, b, c)
    {
        if (a == b && b == c && a != 0)
        {
            return true;
        }
        else
        {
            return false;
        }
    }
}

board = new Board();
let text, newgame, back, turn;
function setup()
{
    cnv = createCanvas(300, 300);
    cnv.parent("sketch");
    background(255);
    
    text = createP();
    
    newgame = createButton("New Game");
    newgame.parent("btn1");
    newgame.mousePressed(() => 
    {
        board = new Board();
    });
    
    back = createButton("Back");
    back.parent("btn2");
    back.mousePressed(()=> 
    {
        board.board[board.lastPlayed[0]][board.lastPlayed[1]] = 0;
        
        if (board.turn == "pc")
        {
            board.turn = "human";
        }
        else
        {
            board.turn = "pc";
        }
        
        board.winner = null;
    });
}

function draw()
{
    background(255);
    board.show();
    
    if (board.turn == "human")
    {
        turn = "Player 1";
    }
    else
    {
        turn = "Player 2";
    }
    
    text.html("Turn: " + turn);
    
    if (board.winner != null)
    {
        if (turn == "Player 1")
        {
            turn = "Player 2";
        }
        else
        {
            turn = "Player 1";
        }
        text.html(turn + " wins!")
    }
}

function mousePressed()
{

    posx = mouseX;
    posy = mouseY;
    
    if (posx > 0 && posx < 300 && posy > 0 && posy < 300)
    {
        px = (posx / 300) * 2;
        py = (posy / 300) * 2;
        
        px = Math.round(px);
        py = Math.round(py);
        
        board.play(py, px);
    }
}
