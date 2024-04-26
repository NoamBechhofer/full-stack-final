import App from './ui/App';

export const metadata = {
  title: 'Notes',
  applicationName: 'NKeeper',
  authors: [
    { name: 'Noam Bechhofer', url: 'https://github.com/NoamBechhofer/' }
  ],
  creator: 'Noam Bechhofer',
  generator: 'next.js',
  keywords: ['notes', 'note-taking', 'app', 'todo', 'to-do'],
  description: 'A simple note-taking app'
};
export default function Page() {
  return <App />;
}
