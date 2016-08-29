// This file is part of www.nand2tetris.org
// and the book "The Elements of Computing Systems"
// by Nisan and Schocken, MIT Press.
// File name: projects/04/Fill.asm

// Runs an infinite loop that listens to the keyboard input.
// When a key is pressed (any key), the program blackens the screen,
// i.e. writes "black" in every pixel. When no key is pressed, the
// program clears the screen, i.e. writes "white" in every pixel.

@offset
M=0

(LOOP)
    @KBD
    D=M

    @BLACK
    D;JGT

    @WHITE
    0;JMP

(BLACK)
    @color
    M=-1

    @DRAW
    0;JMP

(WHITE)
    @color
    M=0

    @DRAW
    0;JMP

(DRAW)
    // Compute the next position at which to draw.
    @SCREEN
    D=A
    @offset
    D=D+M
    @position
    M=D

    // Draw color at position.
    @color
    D=M
    @position
    A=M
    M=D

    // Increment offset, and reset it to 0 if it has reached the end of the screen.
    // The end of the screen is at 256 rows * 32 words = 8192.
    @offset
    M=M+1
    D=M
    @8192
    D=A-D
    @NO-RESET
    D;JGT
    @offset
    M=0
    (NO-RESET)

    @LOOP
    0;JMP
