export class CreatePostDto {
  title: string;
  content: string;
  author: string;
  published?: boolean;
  categoryIds?: number[];
}
