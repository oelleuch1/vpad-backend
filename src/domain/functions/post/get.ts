import { Errors } from "@domain/helpers"
import { SimpleUser } from "@domain/helpers/mappers/user"
import { DatabaseClient } from "@infra/gateways/database"
import { User } from "@prisma/client"

export type PostGetRequest = {
  user: User
  id: string
}

export type PostGetResponse = {
  text: string
  mediaUrl?: string
  thumbUrl?: string
  meta: {
    user: SimpleUser
    likes: number
    dislikes: number
    views: number
    myVote: number
  }
}

export async function postGet(req: PostGetRequest, db: DatabaseClient): Promise<PostGetResponse> {
  const post = await db.post.findFirst({
    where: { id: req.id },
    include: {
      user: {
        select: SimpleUser.selector
      }
    }
  })
  if (!post) throw Errors.NOT_FOUND()

  const [likes, dislikes, views, myVote] = await db.$transaction([
    db.votes.count({
      where: { postId: post.id, vote: 1 }
    }),
    db.votes.count({
      where: { postId: post.id, vote: -1 }
    }),
    db.votes.count({
      where: { postId: post.id },
    }),
    db.votes.findFirst({
      where: { postId: post.id, userId: req.user.id }
    }),
  ])

  return {
    text: post.text,
    mediaUrl: post.mediaUrl ?? undefined,
    thumbUrl: post.thumbUrl ?? undefined,
    meta: {
      user: post.user,
      likes: likes ?? 0,
      dislikes: dislikes ?? 0,
      views: views ?? 0,
      myVote: myVote?.vote ?? 0
    }
  }
}