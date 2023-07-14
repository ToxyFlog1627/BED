import { FunctionComponent, useState } from 'react';
import { keyframes, styled } from 'styled-components';
import useKeybindings from './useKeybindings';

const CARET = '#F0F0F0';
const BG = '#242424';
const BG_SELECTED = '#404040';
const FG = '#C2C2C2';
const NUMBER_FG = '#A2A2A2';
const NUMBER_FG_SELECTED = '#E2E2E2';

const Container = styled.div`
	display: flex;
	flex-direction: row;
	background: ${BG};
	color: ${FG};
	width: 100%;
	height: 100%;
`;

const Column = styled.div`
	display: flex;
	flex-direction: column;
`;

const Line = styled.div<{ selected: boolean }>`
	display: flex;
	flex-direction: row;
	width: 100%;
	cursor: text;
	${props => props.selected && `background: ${BG_SELECTED};`}
`;

const LineNumber = styled(Line)`
	color: ${props => (props.selected ? NUMBER_FG_SELECTED : NUMBER_FG)};
	background: ${BG};
	margin: 0 8px;
`;

const Blinking = keyframes`
    0%     { visibility: visible; }
    49.99% { visibility: visible; }

    50%    { visibility: hidden; }
    100%   { visibility: hidden; }
`;

type CharElementProps = { hasCaret: boolean }; // it messes up syntax highlighting when inlined in variable ¯\_(ツ)_/¯

const CharElement = styled.span.withConfig({
	shouldForwardProp: props => props !== 'hasCaret'
})<CharElementProps>`
	position: relative;
	padding: 1px 0;
	white-space: pre;
	font-size: 14px;
	font-family: 'Droid Sans Mono', 'monospace', monospace;

	&::before {
		content: '';
		position: absolute;
		top: 0;
		right: -1px;
		display: ${props => (props.hasCaret ? 'block' : 'none')};
		background: ${CARET};
		width: 2px;
		height: 100%;
		animation-name: ${Blinking};
		animation-duration: 1s;
		animation-iteration-count: infinite;
	}
`;

type Props = {
	lines: string[];
	setLines: (value: string[]) => void;
};

const Editor: FunctionComponent<Props> = ({ lines, setLines }) => {
	const [caret, setCaret] = useState({ char: -1, line: 0 });

	const limitChar = (char: number, line: number) => Math.min(Math.max(char, -1), lines[line].length - 1);
	const limitLine = (line: number) => Math.min(Math.max(line, 0), lines.length - 1);

	const setChar = (value: number) => setCaret({ ...caret, char: limitChar(value, caret.line) });
	const setLine = (value: number) => {
		const newLine = limitLine(value);
		if (newLine === caret.line) return;
		setCaret({ line: newLine, char: limitChar(caret.char, newLine) });
	};

	useKeybindings({
		ArrowLeft: () => {
			if (caret.char > -1) setChar(caret.char - 1);
			else {
				const newLine = limitLine(caret.line - 1);
				setCaret({ char: limitChar(Infinity, newLine), line: newLine });
			}
		},
		ArrowRight: () => {
			if (caret.char < lines[caret.line].length - 1) setChar(caret.char + 1);
			else setCaret({ char: -1, line: limitLine(caret.line + 1) });
		},
		ArrowDown: () => setLine(caret.line + 1),
		ArrowUp: () => setLine(caret.line - 1)
	});

	if (lines.length === 0) setLines(['']);
	return (
		<Container>
			<Column>
				{lines.map((_, i) => (
					<LineNumber key={i} selected={i === caret.line}>
						{i + 1}
					</LineNumber>
				))}
			</Column>

			<Column style={{ width: '100%' }}>
				{lines.map((line, i) => (
					<Line key={i} selected={i === caret.line} onClick={() => setCaret({ line: i, char: lines[i].length - 1 })}>
						<CharElement id="dummy" hasCaret={i === caret.line && -1 === caret.char} key={i + '.dummy'}>
							&#8203;
						</CharElement>
						{line.split('').map((ch, j) => (
							<CharElement
								hasCaret={i === caret.line && j === caret.char}
								key={i + '.' + j}
								onClick={event => {
									let char = j;
									const target = event.target as HTMLElement;
									if (event.clientX - target.offsetLeft < target.clientWidth / 2) char--;

									setCaret({ line: i, char: limitChar(char, i) });
									event.stopPropagation();
								}}
							>
								{ch}
							</CharElement>
						))}
					</Line>
				))}
			</Column>
		</Container>
	);
};

export default Editor;
