import { expect } from "chai";
import randomString from "random-string";
import { GridDirection } from "../src/GridDirection";
import { WordList } from "../src/WordList";
import { WordSeekPuzzle } from "../src/WordSeekPuzzle";
import { WordSeekFinder } from "../src/WordSeekFinder";

describe("WordSeekPuzzle", function() {
  const getRandomString = () =>
    randomString({ letters: true, numbers: true }).toUpperCase();

  const verifyGridSize = (
    grid: string,
    expectedWidth: number,
    expectedHeight: number
  ): void => {
    if (expectedWidth == 0 || expectedHeight == 0) {
      expect(grid).to.equal("");
    } else {
      expect(grid.length).to.equal(
        (expectedWidth + "\n".length) * expectedHeight
      );
      const lines = grid.split("\n");
      expect(lines.length).to.equal(expectedHeight);
      lines.forEach(line => {
        expect(line.length).to.equal(expectedWidth);
      });
    }
  };

  it("no words, no output", () => {
    const wg = new WordSeekPuzzle(new WordList([]));
    expect(wg.getWidth()).to.equal(0);
    expect(wg.getHeight()).to.equal(0);
    expect(wg.getGridLetters()).to.deep.equal([]);
    expect(wg.getWordsOutput()).to.equal("");
  });

  it("no words, forced grid size, has output", () => {
    const wordList = new WordList([]);
    const gridWidth = 5;
    const gridHeight = 10;

    const wg = new WordSeekPuzzle(wordList, gridWidth, gridHeight);
    expect(wg.getWidth()).to.equal(gridWidth);
    expect(wg.getHeight()).to.equal(gridHeight);
    expect(wg.getWordsOutput()).to.equal("");

    const gridLetters = wg.getGridLetters();
    expect(gridLetters.length).to.equal(gridHeight);
    expect(gridLetters.join("\n").length).to.equal(
      (gridWidth + "\n".length) * gridHeight - 1
    );
  });

  it("one word, is output", () => {
    const testWord = getRandomString();
    const wordList = new WordList([testWord]);
    const wg = new WordSeekPuzzle(wordList);
    expect(wg.getWordsOutput()).to.equal(testWord);

    expect(wg.getGridLetters().join("").length).to.equal(
      wg.getWidth() * wg.getHeight()
    );

    const grid = wg.getGrid();
    const solver = new WordSeekFinder(grid);
    const wordLoc = solver.findWord(testWord);
    expect(wordLoc).to.exist;
  });

  it("no ? left", () => {
    const wordList = new WordList([getRandomString()]);
    const wg = new WordSeekPuzzle(wordList);
    expect(wg.getGridLetters().join("")).to.not.have.string("?");
  });

  it("word output list is sorted", () => {
    const aaa = "AAAAAAAAAAA";
    const bbb = "BBBBB";
    const ccc = "CC";

    const wordList = new WordList([bbb, aaa, ccc]);
    const wg = new WordSeekPuzzle(wordList);
    expect(wg.getWordsOutput()).to.equal([aaa, bbb, ccc].join("\n"));
  });
});
