export const avatarOptions = [
  {
    id: 'sprout',
    label: 'Sprout',
    source: require('../../assets/bloomy-docs/avatars/Gemini_Generated_Image_1ovb7h1ovb7h1ovb.png'),
    backgroundColor: '#E8F6EE',
  },
  {
    id: 'leaf',
    label: 'Leaf',
    source: require('../../assets/bloomy-docs/avatars/Gemini_Generated_Image_3oud5r3oud5r3oud.png'),
    backgroundColor: '#EEF5FF',
  },
  {
    id: 'bloom',
    label: 'Bloom',
    source: require('../../assets/bloomy-docs/avatars/Gemini_Generated_Image_5vcxs85vcxs85vcx.png'),
    backgroundColor: '#FFF5E8',
  },
  {
    id: 'garden',
    label: 'Garden',
    source: require('../../assets/bloomy-docs/avatars/Gemini_Generated_Image_5vhges5vhges5vhg.png'),
    backgroundColor: '#F3EFFC',
  },
  {
    id: 'forest',
    label: 'Forest',
    source: require('../../assets/bloomy-docs/avatars/Gemini_Generated_Image_6i9rfi6i9rfi6i9r.png'),
    backgroundColor: '#E9F4F0',
  },
];

export const defaultAvatarId = avatarOptions[0].id;

export function getAvatarOptionById(avatarId) {
  return avatarOptions.find((avatar) => avatar.id === avatarId) ?? avatarOptions[0];
}
