import { Application } from 'express';
import errorSdkRouter from './err-sdk';
import generateFksPageTemplateRouter from './generate-fks-page-template';
import userRouter from './user';
import blogRouter from './blog';
import blogBackstage from './blog-backstage';
import articleTreeRouter from './article-tree';

export default ({ app, jwtKey }: { app: Application; jwtKey: string }) => {
	generateFksPageTemplateRouter({ app });

	errorSdkRouter({ app });

	userRouter({ app, jwtKey });

	blogRouter({ app });

	blogBackstage({ app });

	articleTreeRouter({ app });
};

/**
 * @swagger
 * components:
 *   schemas:
 *     UserQueryAllResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: 用户id
 *         user_name:
 *           type: string
 *           description: 用户名
 *         pass_word:
 *           type: string
 *           description: 用户密码
 *         user_code:
 *           type: string
 *           description: 用户code
 *         user_standing_id:
 *           type: integer
 *           description: 用户类型id
 *         standing_name:
 *           type: string
 *           description: 用户类型名称
 *         standing_value:
 *           type: integer
 *           description: 用户类型的值
 *     UserQueryAllRequest:
 *       type: object
 *       properties:
 *         pageIndex:
 *           type: integer
 *           description: 要获取的页数
 *         pageSize:
 *           type: integer
 *           description: 每页显示的用户数量
 *     UserLoginResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: 用户id
 *         token:
 *           type: string
 *           description: 用户token
 *         userName:
 *           type: string
 *           description: 用户名
 *         userCode:
 *           type: string
 *           description: 用户Code
 *     UserLoginRequest:
 *       type: object
 *       properties:
 *         userName:
 *           type: string
 *           description: 用户名
 *         passWord:
 *           type: string
 *           description: 加密密码
 *     BlogHotTagsQueryResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: 标签id
 *         article_count:
 *           type: integer
 *           description: 标签下文章数量
 *         tag_name:
 *           type: string
 *           description: 标签名称
 *     BlogTagsQueryResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: 标签id
 *         tag_name:
 *           type: string
 *           description: 标签名称
 *     BlogTagsQueryRequest:
 *       type: object
 *       properties:
 *         pageIndex:
 *           type: integer
 *           description: 要获取的页数
 *         pageSize:
 *           type: integer
 *           description: 每页显示的标签数量
 *         tagName:
 *           type: string
 *           description: 标签名tagName查询
 *     BlogArticleQueryByTagIdResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: 文章id
 *         title:
 *           type: string
 *           description: 文章标题
 *         content:
 *           type: string
 *           description: 文章内容
 *         reading_quantity:
 *           type: integer
 *           description: 文章阅读量
 *         add_time:
 *           type: string
 *           format: date-time
 *           description: 文章发布时间
 *     BlogArticleQueryByTagIdRequest:
 *       type: object
 *       properties:
 *         pageIndex:
 *           type: integer
 *           description: 要获取的页数
 *         pageSize:
 *           type: integer
 *           description: 每页显示的文章数量
 *         byTagId:
 *           type: integer
 *           description: 标签id tagId查询
 *     BlogHotArticleQueryResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: 文章id
 *         title:
 *           type: string
 *           description: 文章标题
 *         content:
 *           type: string
 *           description: 文章内容
 *         reading_quantity:
 *           type: integer
 *           description: 文章阅读量
 *         add_time:
 *           type: string
 *           format: date-time
 *           description: 文章发布时间
 *         tags:
 *           type: string
 *           description: 文章标签
 *     BlogArticleInterviewRequest:
 *       type: object
 *       properties:
 *         articleId:
 *           type: integer
 *           description: 文章id
 *     BlogArticleLikeTitleResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: 文章id
 *         title:
 *           type: string
 *           description: 文章标题
 *         content:
 *           type: string
 *           description: 文章内容
 *         reading_quantity:
 *           type: integer
 *           description: 文章阅读量
 *         add_time:
 *           type: string
 *           format: date-time
 *           description: 文章发布时间
 *         tags:
 *           type: string
 *           description: 文章标签
 *     BlogArticleLikeTitleRequest:
 *       type: object
 *       properties:
 *         pageIndex:
 *           type: integer
 *           description: 要获取的页数
 *         pageSize:
 *           type: integer
 *           description: 每页显示的文章数量
 *         title:
 *           type: string
 *           description: 文章标题模糊查询
 *     BlogQueryForArticleIdResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: 文章id
 *         title:
 *           type: string
 *           description: 文章标题
 *         content:
 *           type: string
 *           description: 文章内容
 *         reading_quantity:
 *           type: integer
 *           description: 文章阅读量
 *         add_time:
 *           type: string
 *           format: date-time
 *           description: 文章发布时间
 *         tags:
 *           type: string
 *           description: 文章标签
 *     BlogQueryForArticleIdRequest:
 *       type: object
 *       properties:
 *         articleTreeId:
 *           type: integer
 *           description: 文章树id
 *     BlogBackstageQueryForArticleIdResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: 文章id
 *         title:
 *           type: string
 *           description: 文章标题
 *         content:
 *           type: string
 *           description: 文章内容
 *         reading_quantity:
 *           type: integer
 *           description: 文章阅读量
 *         add_time:
 *           type: string
 *           format: date-time
 *           description: 文章发布时间
 *         tags:
 *           type: string
 *           description: 文章标签
 *     BlogBackstageQueryForArticleIdRequest:
 *       type: object
 *       properties:
 *         articleId:
 *           type: integer
 *           description: 文章id
 *     BlogBackstageArticleAddRequest:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           description: 新增文章的标题
 *         content:
 *           type: string
 *           description: 新增文章的内容
 *         contentHTML:
 *           type: string
 *           description: 新增文章的内容（包含html标签元素）
 *         author:
 *           type: integer
 *           description: 用户id
 *         articleTreeId:
 *           type: integer
 *           description: 文章树id
 *         articleTags:
 *           type: array
 *           items:
 *             type: integer
 *     BlogBackstageArticleTakebackRequest:
 *       type: object
 *       properties:
 *         articleId:
 *           type: integer
 *           description: 文章id
 *     BlogBackstageArticleReviewRequest:
 *       type: object
 *       properties:
 *         articleId:
 *           type: integer
 *           description: 文章id
 *     BlogBackstageArticleRejectRequest:
 *       type: object
 *       properties:
 *         articleId:
 *           type: integer
 *           description: 文章id
 *     BlogBackstageArticleDraftAddRequest:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           description: 新增文章的标题
 *         content:
 *           type: string
 *           description: 新增文章的内容
 *         contentHTML:
 *           type: string
 *           description: 新增文章的内容（包含html标签元素）
 *         author:
 *           type: integer
 *           description: 用户id
 *         articleTreeId:
 *           type: integer
 *           description: 文章树id
 *         articleTags:
 *           type: array
 *           items:
 *             type: integer
 *     BlogBackstageArticleDeleteRequest:
 *       type: object
 *       properties:
 *         articleId:
 *           type: integer
 *           description: 文章id
 *     BlogBackstageArticleQueryForAuthorResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: 文章id
 *         title:
 *           type: string
 *           description: 文章标题
 *         content:
 *           type: string
 *           description: 文章内容
 *         reading_quantity:
 *           type: integer
 *           description: 文章阅读量
 *         add_time:
 *           type: string
 *           format: date-time
 *           description: 文章发布时间
 *         tags:
 *           type: string
 *           description: 文章标签
 *     BlogBackstageArticleQueryForAuthorRequest:
 *       type: object
 *       properties:
 *         pageIndex:
 *           type: integer
 *           description: 要获取的页数
 *         pageSize:
 *           type: integer
 *           description: 每页显示的文章数量
 *         author:
 *           type: integer
 *           description: 作者id
 *     BlogBackstageArticleQueryForArticleTreeIdResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: 文章id
 *         title:
 *           type: string
 *           description: 文章标题
 *         content:
 *           type: string
 *           description: 文章内容
 *         reading_quantity:
 *           type: integer
 *           description: 文章阅读量
 *         add_time:
 *           type: string
 *           format: date-time
 *           description: 文章发布时间
 *         tags:
 *           type: string
 *           description: 文章标签
 *     BlogBackstageArticleQueryForArticleTreeIdRequest:
 *       type: object
 *       properties:
 *         articleTreeId:
 *           type: integer
 *           description: 文章树id
 *     BlogBackstageArticleQueryForArticleResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: 文章id
 *         title:
 *           type: string
 *           description: 文章标题
 *         content:
 *           type: string
 *           description: 文章内容
 *         reading_quantity:
 *           type: integer
 *           description: 文章阅读量
 *         add_time:
 *           type: string
 *           format: date-time
 *           description: 文章发布时间
 *         tags:
 *           type: string
 *           description: 文章标签
 *     BlogBackstageArticleQueryForArticleRequest:
 *       type: object
 *       properties:
 *         articleId:
 *           type: integer
 *           description: 文章id
 *     BlogBackstageArticleAllQueryResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: 文章id
 *         title:
 *           type: string
 *           description: 文章标题
 *         content:
 *           type: string
 *           description: 文章内容
 *         reading_quantity:
 *           type: integer
 *           description: 文章阅读量
 *         add_time:
 *           type: string
 *           format: date-time
 *           description: 文章发布时间
 *         tags:
 *           type: string
 *           description: 文章标签
 *     BlogBackstageArticleAllQueryRequest:
 *       type: object
 *       properties:
 *         pageIndex:
 *           type: integer
 *           description: 要获取的页数
 *         pageSize:
 *           type: integer
 *           description: 每页显示的文章数量
 *     ArticleTreeArticleTreeNameQueryRequest:
 *       type: object
 *       properties:
 *         pageIndex:
 *           type: integer
 *           description: 要获取的页数
 *         pageSize:
 *           type: integer
 *           description: 每页显示的文章树数量
 *         articleTreeName:
 *           type: string
 *           description: 文章树名称articleTreeName
 *     ArticleTreeByIdDeleteRequest:
 *       type: object
 *       properties:
 *         articleTreeId:
 *           type: integer
 *           description: 文章树id
 *     UserRegisterRequest:
 *       type: object
 *       properties:
 *         userName:
 *           type: string
 *           description: 用户名
 *         passWord:
 *           type: string
 *           description: 加密密码
 *     UserUpdateRequest:
 *       type: object
 *       properties:
 *         author:
 *           type: integer
 *           description: 用户id
 *         passWord:
 *           type: string
 *           description: 加密密码
 *     UserDeleteRequest:
 *       type: object
 *       properties:
 *         author:
 *           type: integer
 *           description: 用户id
 *     ArticleTreeTable:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: 文章树id
 *         article_tree_name:
 *           type: string
 *           description: 文章树标题
 *         parent_article_tree_id:
 *           type: string
 *           description: 父级文章树
 *     MySQLResult:
 *       type: object
 *       properties:
 *         fieldCount:
 *           type: integer
 *           description: 描述
 *         affectedRows:
 *           type: integer
 *           description: 描述
 *         insertId:
 *           type: integer
 *           description: 描述
 *         info:
 *           type: string
 *           description: 描述
 *         serverStatus:
 *           type: integer
 *           description: 描述
 *         warningStatus:
 *           type: integer
 *           description: 描述
 *         changedRows:
 *           type: integer
 *           description: 描述
 */
