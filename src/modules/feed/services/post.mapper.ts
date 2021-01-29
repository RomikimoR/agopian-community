import { MessageAudioElement, MessageElement, MessageImageElement, MessageTextElement, MessageVideoElement, MessageYoutubeElement, Post, PostData, PostMessage } from '../post.model';

export class PostMapper {
  map(data: PostData): Post {
    return {
      ...data,
      message: this.parseMessage(`${data.message} ${data.attachementUrl ? data.attachementUrl : ''}`)
    }
  }

  private parseMessage(message: string): PostMessage {
    // TODO rajouter png jpg et gif
    const pictureRegex = new RegExp("(?:https?:\/\/)?(?:www\.)?[^ ]*\.(jpeg|jpg|png|gif)");

     // TODO mp4,wmv,flv,avi,wav
    const videoRegex = new RegExp("(?:https?:\/\/)?(?:www\.).*\.(mp4|wmv|flv|avi|wav)");

     // TODO mp3,ogg,wav
    const audioRegex = new RegExp("(mp3|ogg|wav)$");

    const youtubeRegex = new RegExp(String.raw`.*(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?.*`);
    const attachements: MessageElement[] = [];


    const pictureMatche = pictureRegex.exec(message);
    if (pictureMatche) {
      attachements.push( {
        type: 'image',
        url: pictureMatche[0]
      } );
    }

    const videoMatche = videoRegex.exec(message)
    if (videoMatche) {
      attachements.push( {
        type: 'video',
        url: videoMatche[0]
      } );

    }

    const audioMatche = audioRegex.exec(message)
    if (audioMatche) {
      attachements.push( {
        type: 'audio',
        url: message
      } );

    }

    const youtubeMatche = youtubeRegex.exec(message)
    if (youtubeMatche) {
      attachements.push( {
        type: 'youtube',
        videoId: youtubeMatche[1]
      } );
    }

    return {
      text: {
        type: 'text',
        content: message
      } as MessageTextElement,
      attachements
    };
  }
}
