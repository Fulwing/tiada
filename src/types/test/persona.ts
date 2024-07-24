export default interface Persona {
    id: number;
    name: string;
    occupation: string;
    age: number;
    gender: string;
    experience: boolean;
    location: string;
    characteristic: string;
    createdAt?: Date;
}

const mockPersonas: Persona[] = [
    {
        id: 1,
        name: "Samantha Parker",
        occupation: "Digital Marketing Specialist",
        age: 29,
        gender: "Female",
        experience: true,
        location: "San Francisco, California",
        characteristic: "Samantha Parker is an innovative, modern-day digital marketer residing in the heart of San Francisco. With her finger constantly on the pulse of the latest trends, she uses Instagram as a crucial part of her marketing strategies. Known for her vibrant and artistic posts, Samantha combines her deep love for aesthetics with analytical rigor to create compelling content that boosts engagement and drives brand awareness. Her profile is a colorful mix of professional insights, trending hashtags, and personal anecdotes, providing her followers with a well-rounded and engaging experience. On weekends, Samantha enjoys exploring the city's vibrant arts and food scene, often sharing these adventures on her Instagram Stories."
    },
    {
        id: 2,
        name: "Michael Chen",
        occupation: "Software Engineer",
        age: 34,
        gender: "Male",
        experience: true,
        location: "Seattle, Washington",
        characteristic: "Michael Chen is a seasoned software engineer with a passion for cutting-edge technologies. Based in Seattle's tech hub, he specializes in cloud computing and machine learning applications. Michael's analytical mind and problem-solving skills make him an asset in developing robust, scalable solutions for complex business challenges. Outside of work, he's an avid hiker and nature photographer, often using his technical skills to develop apps that enhance outdoor experiences. Michael is known for his ability to bridge the gap between technical complexities and user-friendly designs, making him a valuable team member in cross-functional projects."
    }
];