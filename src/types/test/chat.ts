export default interface ConversationEntry {
    role: 'system' | 'user' | 'assistant';
    content: Content[] | string;
}

interface TextContent {
    type: 'text';
    text: string;
}

interface ImageContent {
    type: 'image_url';
    image_url: {
        url: string;
    };
}

type Content = TextContent | ImageContent;