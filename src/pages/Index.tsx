import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import Icon from '@/components/ui/icon';

interface Track {
  id: number;
  title: string;
  artist: string;
  duration: string;
  audioUrl: string;
}

const tracks: Track[] = [
  {
    id: 1,
    title: 'Neon Dreams',
    artist: 'Synthwave Collective',
    duration: '3:45',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
  },
  {
    id: 2,
    title: 'Digital Horizon',
    artist: 'Electric Minds',
    duration: '4:12',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'
  },
  {
    id: 3,
    title: 'Cosmic Waves',
    artist: 'Astro Beats',
    duration: '3:58',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'
  },
  {
    id: 4,
    title: 'Midnight Circuit',
    artist: 'Cyber Dreams',
    duration: '4:30',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3'
  },
  {
    id: 5,
    title: 'Binary Love',
    artist: 'Data Romance',
    duration: '3:22',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3'
  },
  {
    id: 6,
    title: 'Quantum Pulse',
    artist: 'Future Sound',
    duration: '4:05',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3'
  }
];

const Index = () => {
  const [currentTrack, setCurrentTrack] = useState<Track>(tracks[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([70]);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume[0] / 100;
    }
  }, [volume]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const playTrack = (track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.play();
      }
    }, 100);
  };

  const skipTrack = (direction: 'prev' | 'next') => {
    const currentIndex = tracks.findIndex(t => t.id === currentTrack.id);
    let newIndex;
    
    if (direction === 'next') {
      newIndex = currentIndex + 1 >= tracks.length ? 0 : currentIndex + 1;
    } else {
      newIndex = currentIndex - 1 < 0 ? tracks.length - 1 : currentIndex - 1;
    }
    
    playTrack(tracks[newIndex]);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/20 pointer-events-none" />
      
      <div className="relative z-10">
        <section className="min-h-[60vh] flex items-center justify-center px-4 py-20">
          <div className="max-w-6xl w-full text-center animate-fade-in">
            <h1 className="text-7xl md:text-9xl font-bold mb-6 text-glow">
              SONIC
            </h1>
            <p className="text-2xl md:text-3xl text-muted-foreground mb-8 font-light">
              Экспериментальное музыкальное пространство
            </p>
            
            <div className="flex gap-4 justify-center mb-12">
              <div className="w-2 h-16 bg-primary animate-wave" style={{ animationDelay: '0s' }} />
              <div className="w-2 h-16 bg-secondary animate-wave" style={{ animationDelay: '0.1s' }} />
              <div className="w-2 h-16 bg-accent animate-wave" style={{ animationDelay: '0.2s' }} />
              <div className="w-2 h-16 bg-primary animate-wave" style={{ animationDelay: '0.3s' }} />
              <div className="w-2 h-16 bg-secondary animate-wave" style={{ animationDelay: '0.4s' }} />
            </div>
          </div>
        </section>

        <section className="px-4 py-12 max-w-6xl mx-auto">
          <Card className="bg-card/80 backdrop-blur-xl border-2 border-primary/30 p-8 hover-lift">
            <div className="flex flex-col md:flex-row gap-8 items-center mb-6">
              <div className="w-48 h-48 bg-gradient-to-br from-primary via-secondary to-accent rounded-lg flex items-center justify-center flex-shrink-0 animate-pulse-glow">
                <Icon name={isPlaying ? "Radio" : "Music"} size={80} className="text-white" />
              </div>
              
              <div className="flex-1 w-full">
                <h2 className="text-3xl font-bold mb-2">{currentTrack.title}</h2>
                <p className="text-xl text-muted-foreground mb-6">{currentTrack.artist}</p>
                
                <div className="space-y-2 mb-4">
                  <Slider
                    value={[currentTime]}
                    max={duration || 100}
                    step={1}
                    onValueChange={handleSeek}
                    className="cursor-pointer"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => skipTrack('prev')}
                    className="w-12 h-12 rounded-full"
                  >
                    <Icon name="SkipBack" size={20} />
                  </Button>
                  
                  <Button
                    size="icon"
                    onClick={togglePlay}
                    className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-secondary hover:from-primary/80 hover:to-secondary/80"
                  >
                    <Icon name={isPlaying ? "Pause" : "Play"} size={28} />
                  </Button>
                  
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => skipTrack('next')}
                    className="w-12 h-12 rounded-full"
                  >
                    <Icon name="SkipForward" size={20} />
                  </Button>

                  <div className="flex items-center gap-2 ml-auto">
                    <Icon name="Volume2" size={20} className="text-muted-foreground" />
                    <Slider
                      value={volume}
                      max={100}
                      step={1}
                      onValueChange={setVolume}
                      className="w-24"
                    />
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </section>

        <section className="px-4 py-12 max-w-6xl mx-auto pb-32">
          <h2 className="text-4xl font-bold mb-8 text-center">Плейлист</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tracks.map((track, index) => (
              <Card
                key={track.id}
                className={`p-6 cursor-pointer transition-all duration-300 hover-lift ${
                  currentTrack.id === track.id
                    ? 'bg-gradient-to-br from-primary/30 to-secondary/30 border-primary'
                    : 'bg-card/60 backdrop-blur-sm hover:bg-card/80'
                }`}
                onClick={() => playTrack(track)}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold mb-1">{track.title}</h3>
                    <p className="text-sm text-muted-foreground">{track.artist}</p>
                  </div>
                  {currentTrack.id === track.id && isPlaying && (
                    <div className="flex gap-1 items-end h-6">
                      <div className="w-1 bg-primary animate-wave h-full" style={{ animationDelay: '0s' }} />
                      <div className="w-1 bg-primary animate-wave h-full" style={{ animationDelay: '0.2s' }} />
                      <div className="w-1 bg-primary animate-wave h-full" style={{ animationDelay: '0.4s' }} />
                    </div>
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{track.duration}</span>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="w-8 h-8"
                    onClick={(e) => {
                      e.stopPropagation();
                      playTrack(track);
                    }}
                  >
                    <Icon name="Play" size={16} />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </div>

      <audio ref={audioRef} src={currentTrack.audioUrl} />
    </div>
  );
};

export default Index;
