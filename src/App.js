import './styles/App.css';
import GuessContainer from './components/guessContainer';

function App() {
  return (
    <div className="App">
      <h4>
        Enter the following guess.
      </h4>
      <p>
        Then tap the letters to match the colors with the Wordle response and click Next.
      </p>
      <GuessContainer />
    </div>
  );
}

export default App;
