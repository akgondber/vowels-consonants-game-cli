import React, {useState, useEffect} from 'react';
import {Text, Box, useInput} from 'ink';
import Gradient from 'ink-gradient';
import TextInput from 'ink-text-input';
import BigText from 'ink-big-text';
import figures from './figures.js';

type Props = {
	isBannerDisabled?: boolean;
	words?: string[];
	speed?: number;
	hasExtraComplication?: boolean;
};

type Subject = 'VOWELS' | 'CONSONANTS';

const wordsSuite = [
	['coal', 'attention', 'deliberation', 'evasion', 'relation', 'vagary'],
	['drain', 'moisture', 'surprise', 'glove', 'fatherhood', 'exposition'],
	[
		'testimony',
		'attention',
		'affliction',
		'absence',
		'instructor',
		'statement',
	],
];

const defaultWords = wordsSuite[0];

const hideWord = (word: string): string => {
	let result = '';
	let i = 0;
	while (i < word.length) {
		result += '-';
		i++;
	}

	return result;
};

const charIsVowel = (char: string) => {
	const charLower = char.toLowerCase();
	return ['a', 'e', 'i', 'o', 'u', 'y'].includes(charLower);
};

const getVowelCount = (word: string): number => {
	let result = 0;

	for (const char of word) {
		if (
			((char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z')) &&
			charIsVowel(char)
		) {
			result += 1;
		}
	}

	return result;
};

const getConsonantCount = (word: string): number => {
	let result = 0;

	for (const char of word) {
		if (
			((char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z')) &&
			!charIsVowel(char)
		) {
			result += 1;
		}
	}

	return result;
};

const isNumeric = (value: string): boolean =>
	!Number.isNaN(value as any) && !Number.isNaN(Number.parseFloat(value));

const calculateSpeedInMs = (speed: number) => {
	return (speed / 10) * 150;
};

export {isNumeric, hideWord};

export default function App({
	isBannerDisabled = false,
	words,
	speed = 3,
	hasExtraComplication = false,
}: Props) {
	const [showBanner, setShowBanner] = useState(!isBannerDisabled);
	const [answer, setAnswer] = useState('');
	const [consonantsAnswer, setConsonantsAnswer] = useState('');
	const [scores, setScores] = useState(0);
	const [padLeft, setPadLeft] = useState(0);
	const [gameOver, setGameOver] = useState(false);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [gameSpeed, setGameSpeed] = useState(calculateSpeedInMs(speed));
	const [isChangingSpeed, setIsChangingSpeed] = useState(false);
	const [addComplication, setAddComplication] = useState(hasExtraComplication);
	const [vowelCountIsCorrect, setVowelCountIsCorrect] = useState(false);
	const [consonantCountIsCorrect, setConsonantCountIsCorrect] = useState(false);
	const [newChangingSpeedValue, setNewChangingSpeedValue] = useState(
		String(speed),
	);
	const [currentSubject, setCurrentSubject] = useState<Subject>('VOWELS');
	const [error, setError] = useState('');
	const [roundWords, setRoundWords] = useState<string[]>(
		words && words.length > 0 ? words : defaultWords!,
	);

	const resetGame = () => {
		setGameOver(false);
		setCurrentIndex(0);
		setCurrentSubject('VOWELS');
		setRoundWords(wordsSuite[Math.floor(Math.random() * wordsSuite.length)]!);
		setPadLeft(0);
		setScores(0);
		setVowelCountIsCorrect(false);
		setConsonantCountIsCorrect(false);
		setAnswer('');
		setConsonantsAnswer('');
	};

	useEffect(() => {
		const appInterval = setInterval(() => {
			if (
				padLeft + roundWords[currentIndex]!.length + 3 >
				process.stdout.columns
			) {
				if (currentIndex >= roundWords.length - 1) {
					clearInterval(appInterval);
					setGameOver(true);
					return;
				}

				setCurrentIndex(previousIndex => {
					return previousIndex + 1;
				});
				setCurrentSubject('VOWELS');
				setAnswer('');
				setConsonantsAnswer('');
				setPadLeft(0);
				setVowelCountIsCorrect(false);
				setConsonantCountIsCorrect(false);
			} else {
				setPadLeft(previousP => {
					return previousP + 1;
				});
			}
		}, gameSpeed);

		setTimeout(() => {
			if (showBanner) {
				setShowBanner(false);
			}
		}, 1400);

		return () => {
			clearInterval(appInterval);
		};
	}, [currentIndex, padLeft, gameSpeed, roundWords, showBanner]);

	useInput((input, key) => {
		if (gameOver) {
			switch (input) {
				case 'n': {
					resetGame();

					break;
				}

				case 't': {
					setAddComplication(!addComplication);

					break;
				}

				case 's': {
					setIsChangingSpeed(true);

					break;
				}
				// No default
			}
		} else if (key.tab) {
			setCurrentSubject(isVowelSubject() ? 'CONSONANTS' : 'VOWELS');
		}
	});

	const hasError = () => error !== '';
	const getCurrentWord = (): string => {
		return roundWords[currentIndex]!;
	};

	const getCurrentWordUpper = (): string => {
		return getCurrentWord().toUpperCase();
	};

	const isVowelSubject = (): boolean => currentSubject === 'VOWELS';

	const Success = <Text color="green"> {figures.tick}</Text>;
	const Pointer = <Text color="cyan">{figures.pointer} </Text>;

	return showBanner ? (
		<Box flexDirection="column" alignItems="center">
			<Gradient name="rainbow">
				<BigText text="VOWELS-CONSONANTS" />
			</Gradient>
			<Gradient name="summer">
				<BigText text="Count them up" />
			</Gradient>
		</Box>
	) : gameOver ? (
		isChangingSpeed ? (
			<Box flexDirection="column">
				{hasError() && <Text color="red">{error}</Text>}
				<Box>
					<Text>New speed: </Text>
					<TextInput
						focus={isChangingSpeed}
						value={newChangingSpeedValue}
						onChange={value => {
							setNewChangingSpeedValue(value);
							if (hasError() && isNumeric(value)) {
								setError('');
							}
						}}
						onSubmit={value => {
							if (isNumeric(value)) {
								const newSpeed = Number(value);
								if (hasError()) {
									setError('');
								}

								setGameSpeed(calculateSpeedInMs(newSpeed));
								setIsChangingSpeed(false);
							} else {
								setError('Wrong speed value');
							}
						}}
					/>
				</Box>
			</Box>
		) : (
			<Box flexDirection="column">
				<Text>
					<Text color="green">Result:</Text> {scores} of {roundWords.length}
				</Text>
				<Box flexDirection="column" paddingTop={2}>
					<Text>Press: </Text>
					<Box flexDirection="column">
						<Box>
							<Text bold color="green">
								n
							</Text>
							<Text> - start a new round</Text>
						</Box>
						<Box>
							<Text bold color="cyan">
								s
							</Text>
							<Text> - change game speed</Text>
						</Box>
						<Box>
							<Text bold color="magenta">
								t
							</Text>
							<Text>
								{' '}
								- toggle `complicate` setting (current:{' '}
								{addComplication ? 'enabled' : 'disabled'})
							</Text>
						</Box>
					</Box>
				</Box>
			</Box>
		)
	) : (
		<Box flexDirection="column">
			<Box paddingLeft={padLeft} flexDirection="column">
				<Text>
					{addComplication
						? padLeft % 5 === 0 ||
						  (padLeft % 3 === 0 && padLeft % 2 === 0) ||
						  (padLeft % 4 === 0 && padLeft % 5 === 0)
							? hideWord(getCurrentWord())
							: getCurrentWordUpper()
						: getCurrentWordUpper()}
				</Text>
			</Box>
			<Box
				width={process.stdout.columns}
				alignItems="center"
				justifyContent="space-around"
				paddingTop={2}
			>
				<Box>
					<Text>
						<Text color={isVowelSubject() ? 'cyan' : ''}>VOWELS</Text>:{' '}
						{isVowelSubject() && Pointer}
					</Text>
					<TextInput
						focus={currentSubject === 'VOWELS'}
						value={answer}
						onChange={setAnswer}
						onSubmit={va => {
							const userAnswer = Number(va);
							const currentRoundWord = roundWords[currentIndex]!;
							const correctCount = getVowelCount(currentRoundWord);

							if (userAnswer === correctCount) {
								if (consonantCountIsCorrect) {
									if (currentIndex >= roundWords.length - 1) {
										setGameOver(true);
										setConsonantsAnswer('');
										return;
									}

									setScores(scores + 1);
									setCurrentIndex(currentIndex + 1);
									setVowelCountIsCorrect(false);
									setPadLeft(0);
									setAnswer('');
									setConsonantsAnswer('');
									setConsonantCountIsCorrect(false);
								} else {
									setCurrentSubject('CONSONANTS');
									setVowelCountIsCorrect(true);
								}
							}
						}}
					/>
					{vowelCountIsCorrect && Success}
				</Box>
				<Box>
					<Text>
						<Text color={isVowelSubject() ? '' : 'cyan'}>CONSONANTS</Text>:{' '}
						{!isVowelSubject() && Pointer}
					</Text>
					<TextInput
						focus={currentSubject === 'CONSONANTS'}
						value={consonantsAnswer}
						onChange={setConsonantsAnswer}
						onSubmit={va => {
							const userAnswer = Number(va);
							const currentRoundWord = roundWords[currentIndex]!;
							const correctCount = getConsonantCount(currentRoundWord);

							if (userAnswer === correctCount) {
								if (vowelCountIsCorrect) {
									if (currentIndex >= roundWords.length - 1) {
										setGameOver(true);
										setConsonantsAnswer('');
										return;
									}

									setScores(scores + 1);
									setCurrentSubject('VOWELS');
									setCurrentIndex(currentIndex + 1);
									setConsonantCountIsCorrect(false);
									setVowelCountIsCorrect(false);
									setConsonantsAnswer('');
									setPadLeft(0);
									setAnswer('');
								} else {
									setConsonantCountIsCorrect(true);
									setCurrentSubject('VOWELS');
								}
							}
						}}
					/>
					{consonantCountIsCorrect && Success}
				</Box>
				<Box justifyContent="flex-end">
					<Text color="#adefd1" backgroundColor="#00203f">
						SCORE: {scores}
					</Text>
				</Box>
			</Box>
		</Box>
	);
}
