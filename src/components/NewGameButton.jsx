import MysticalButton from './ui/MysticalButton';
import { RotateCcw, ArrowRight, Play } from 'lucide-react';

function NewGameButton({ onReset, onNextGame, gameOver, seriesWinner, gameMode }) {
  const handleClick = () => {
    if (seriesWinner || (gameOver && gameMode > 1) || (gameOver && gameMode === 1)) {
      if (onNextGame) onNextGame();
    } else if (onReset) {
      onReset();
    }
  };

  const getConfig = () => {
    if (seriesWinner) {
      return { text: 'New Series', icon: <Play size={20} /> };
    }
    if (gameOver && gameMode && gameMode > 1) {
      return { text: 'Next Game', icon: <ArrowRight size={20} /> };
    }
    return { text: 'New Game', icon: <RotateCcw size={20} /> };
  };

  const { text, icon } = getConfig();

  return (
    <div className="mt-8">
      <MysticalButton
        variant="primary"
        onClick={handleClick}
        className="px-8 py-3 text-lg space-x-2"
      >
        {icon}
        <span>{text}</span>
      </MysticalButton>
    </div>
  );
}

export default NewGameButton;
