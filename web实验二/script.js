// 音乐播放列表
const playlist = [
    {
        id: 1,
        title: '枫',
        artist: '周杰伦',
        src: 'mp3/1.mp3',
        cover: 'img/1.png',
        duration: '04:35'
    },
    {
        id: 2,
        title: '搁浅',
        artist: '周杰伦',
        src: 'mp3/2.mp3',
        cover: 'img/2.png',
        duration: '04:00'
    },
    {
        id: 3,
        title: '爱在西元前',
        artist: '周杰伦',
        src: 'mp3/3.mp3',
        cover: 'img/3.png',
        duration: '03:54'
    },
    {
        id: 4,
        title: '超人不会飞',
        artist: '周杰伦',
        src: 'mp3/4.mp3',
        cover: 'img/4.png',
        duration: '05:00'
    },
    {
        id: 5,
        title: '红尘客栈',
        artist: '周杰伦',
        src: 'mp3/5.mp3',
        cover: 'img/5.png',
        duration: '04:34'
    }
];

// 获取DOM元素
const audioPlayer = document.getElementById('audio-player');
const playBtn = document.getElementById('play-btn');
const playIcon = document.getElementById('play-icon');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const progressBar = document.getElementById('progress-bar');
const progressContainer = document.getElementById('progress-container');
const volumeBar = document.getElementById('volume-bar');
const volumeContainer = document.getElementById('volume-container');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
const songTitle = document.getElementById('song-title');
const artistName = document.getElementById('artist-name');
const albumCover = document.getElementById('album-cover');
const playlistEl = document.getElementById('playlist');

// 初始化变量
let currentSongIndex = 0;
let isPlaying = false;
let isDraggingProgress = false;
let isDraggingVolume = false;

// 初始化播放器
function initPlayer() {
    // 生成播放列表
    renderPlaylist();
    // 加载第一首歌
    loadSong(currentSongIndex);
    // 设置初始音量
    audioPlayer.volume = 0.8;
    updateVolumeBar();
}

// 渲染播放列表
function renderPlaylist() {
    playlistEl.innerHTML = '';
    
    playlist.forEach((song, index) => {
        const li = document.createElement('li');
        li.className = `playlist-item ${index === currentSongIndex ? 'active' : ''}`;
        li.innerHTML = `
            <div class="playlist-item-index">${index + 1}</div>
            <div class="playlist-item-info">
                <div class="playlist-item-title">${song.title}</div>
                <div class="playlist-item-artist">${song.artist}</div>
            </div>
            <div class="playlist-item-duration">${song.duration}</div>
        `;
        
        li.addEventListener('click', () => {
            loadSong(index);
            if (isPlaying) {
                playSong();
            }
        });
        
        playlistEl.appendChild(li);
    });
}

// 更新播放列表高亮
function updatePlaylistHighlight() {
    const items = document.querySelectorAll('.playlist-item');
    items.forEach((item, index) => {
        if (index === currentSongIndex) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

// 加载歌曲
function loadSong(index) {
    if (index < 0 || index >= playlist.length) return;
    
    const song = playlist[index];
    currentSongIndex = index;
    
    // 更新音频源
    audioPlayer.src = song.src;
    
    // 更新UI
    songTitle.textContent = song.title;
    artistName.textContent = song.artist;
    albumCover.src = song.cover;
    durationEl.textContent = song.duration;
    
    // 更新播放列表高亮
    updatePlaylistHighlight();
    
    // 重置进度条
    progressBar.style.width = '0%';
    currentTimeEl.textContent = '00:00';
    
    // 如果之前正在播放，继续播放
    if (isPlaying) {
        playSong();
    }
}

// 播放/暂停功能
function togglePlay() {
    if (isPlaying) {
        pauseSong();
    } else {
        playSong();
    }
}

function playSong() {
    audioPlayer.play()
        .then(() => {
            isPlaying = true;
            playIcon.className = 'fas fa-pause';
            albumCover.classList.add('playing');
        })
        .catch(error => {
            console.error('播放失败:', error);
        });
}

function pauseSong() {
    audioPlayer.pause();
    isPlaying = false;
    playIcon.className = 'fas fa-play';
    albumCover.classList.remove('playing');
}

// 下一首
function nextSong() {
    currentSongIndex = (currentSongIndex + 1) % playlist.length;
    loadSong(currentSongIndex);
}

// 上一首
function prevSong() {
    currentSongIndex = (currentSongIndex - 1 + playlist.length) % playlist.length;
    loadSong(currentSongIndex);
}

// 更新进度条
function updateProgress() {
    if (!isDraggingProgress && audioPlayer.duration) {
        const progressPercent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        progressBar.style.width = `${progressPercent}%`;
        
        // 更新当前时间显示
        currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
    }
}

// 跳转播放进度
function setProgress(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audioPlayer.duration;
    
    if (duration) {
        audioPlayer.currentTime = (clickX / width) * duration;
    }
}

// 更新音量
function updateVolume() {
    audioPlayer.volume = parseFloat(volumeBar.style.width) / 100;
}

// 设置音量
function setVolume(e) {
    if (!isDraggingVolume) return;
    
    const width = volumeContainer.clientWidth;
    const clickX = e.offsetX;
    const volumePercent = Math.max(0, Math.min(100, (clickX / width) * 100));
    
    volumeBar.style.width = `${volumePercent}%`;
    updateVolume();
}

// 更新音量条
function updateVolumeBar() {
    volumeBar.style.width = `${audioPlayer.volume * 100}%`;
}

// 格式化时间
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// 事件监听
playBtn.addEventListener('click', togglePlay);
nextBtn.addEventListener('click', nextSong);
prevBtn.addEventListener('click', prevSong);

// 音频事件
audioPlayer.addEventListener('timeupdate', updateProgress);
audioPlayer.addEventListener('ended', nextSong);
audioPlayer.addEventListener('loadedmetadata', function() {
    durationEl.textContent = formatTime(audioPlayer.duration);
});

// 进度条事件
progressContainer.addEventListener('click', setProgress);

progressContainer.addEventListener('mousedown', () => {
    isDraggingProgress = true;
});

document.addEventListener('mousemove', (e) => {
    if (isDraggingProgress) {
        const rect = progressContainer.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const width = progressContainer.clientWidth;
        const progressPercent = Math.max(0, Math.min(100, (clickX / width) * 100));
        
        progressBar.style.width = `${progressPercent}%`;
        
        if (audioPlayer.duration) {
            audioPlayer.currentTime = (progressPercent / 100) * audioPlayer.duration;
        }
    }
});

document.addEventListener('mouseup', () => {
    isDraggingProgress = false;
});

// 音量条事件
volumeContainer.addEventListener('click', setVolume);

volumeContainer.addEventListener('mousedown', () => {
    isDraggingVolume = true;
});

document.addEventListener('mousemove', (e) => {
    if (isDraggingVolume) {
        const rect = volumeContainer.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const width = volumeContainer.clientWidth;
        const volumePercent = Math.max(0, Math.min(100, (clickX / width) * 100));
        
        volumeBar.style.width = `${volumePercent}%`;
        updateVolume();
    }
});

document.addEventListener('mouseup', () => {
    isDraggingVolume = false;
});

// 键盘快捷键
document.addEventListener('keydown', (e) => {
    switch(e.code) {
        case 'Space':
            e.preventDefault();
            togglePlay();
            break;
        case 'ArrowRight':
            if (e.ctrlKey) {
                e.preventDefault();
                nextSong();
            }
            break;
        case 'ArrowLeft':
            if (e.ctrlKey) {
                e.preventDefault();
                prevSong();
            }
            break;
        case 'ArrowUp':
            if (e.ctrlKey) {
                e.preventDefault();
                audioPlayer.volume = Math.min(1, audioPlayer.volume + 0.1);
                updateVolumeBar();
            }
            break;
        case 'ArrowDown':
            if (e.ctrlKey) {
                e.preventDefault();
                audioPlayer.volume = Math.max(0, audioPlayer.volume - 0.1);
                updateVolumeBar();
            }
            break;
    }
});

// 初始化播放器
initPlayer();

// 添加初始化提示
console.log('🎵 音乐播放器已加载完毕！');
console.log('🎮 快捷键:');
console.log('   空格键 - 播放/暂停');
console.log('   Ctrl+左箭头 - 上一首');
console.log('   Ctrl+右箭头 - 下一首');
console.log('   Ctrl+上箭头 - 增加音量');
console.log('   Ctrl+下箭头 - 降低音量');