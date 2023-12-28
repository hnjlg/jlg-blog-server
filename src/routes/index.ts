import { Application } from 'express';
import errorSdkRouter from './err-sdk';
import generateFksPageTemplateRouter from './generate-fks-page-template';
import userRouter from './user';
import blogRouter from './blog';
import blogBackstage from './blog-backstage';
import articleTreeRouter from './article-tree';
import articleTagsRouter from './article-tags';
import routerConfigRouter from './router-config';
import fileRouter from './file';

export default ({ app, jwtKey }: { app: Application; jwtKey: string }) => {
	generateFksPageTemplateRouter({ app });

	errorSdkRouter({ app });

	userRouter({ app, jwtKey });

	blogRouter({ app });

	blogBackstage({ app, jwtKey });

	articleTreeRouter({ app });

	articleTagsRouter({ app });

	routerConfigRouter({ app, jwtKey });

	fileRouter({ app });
};

/**
 * @swagger
 * components:
 *   schemas:
 *     FileUploadRequest:
 *       type: object
 *       properties:
 *         file:
 *           type: string
 *           format: binary
 *           description: 文件流
 *     FileUploadResult:
 *       type: object
 *       properties:
 *         fieldname:
 *           type: string
 *           description: 字段名
 *         originalname:
 *           type: string
 *           description: 上传文件名
 *         encoding:
 *           type: string
 *           description: 文件编码
 *         mimetype:
 *           type: string
 *           description: 文件类型
 *         destination:
 *           type: string
 *           description: 保存路径
 *         filename:
 *           type: string
 *           description: 保存文件名
 *         path:
 *           type: string
 *           description: 保存文件路径
 *         size:
 *           type: integer
 *           description: 文件大小
 *     BlogBackstageArticleDraftTurnWaitReviewRequest:
 *       type: object
 *       properties:
 *         articleId:
 *           type: integer
 *           description: 文章id
 *     UserStanding:
 *       type: integer
 *       format: int32
 *       description: 1=普通用户2=管理员
 *       enum: [1,2]
 *       x-enumNames: [普通用户,管理员]
 *     ArticleStatus:
 *       type: integer
 *       format: int32
 *       description: 1=草稿2=待审3=公开4=私有5=驳回
 *       enum: [1,2,3,4,5]
 *       x-enumNames: [草稿,待审,公开,私有,驳回]
 *     SelectListItem:
 *       type: object
 *       properties:
 *         label:
 *           type: string
 *           description: 文本
 *         value:
 *           type: integer
 *           description: 值
 *     BlogBackstageArticleEditRequest:
 *       type: object
 *       properties:
 *         articleId:
 *           type: integer
 *           description: 编辑文章的id
 *         title:
 *           type: string
 *           description: 编辑文章的标题
 *         content:
 *           type: string
 *           description: 编辑文章的内容
 *         content_html:
 *           type: string
 *           description: 编辑文章的内容（包含html标签元素）
 *         article_tree_id:
 *           type: integer
 *           description: 文章树id
 *         articleTags:
 *           type: array
 *           description: 文章标签列表
 *           items:
 *             type: integer
 *     RouterMeta:
 *       type: object
 *       properties:
 *         keepAlive:
 *           type: boolean
 *           description: 是否缓存路由组件
 *         systemPage:
 *           type: boolean
 *           description: 是否是系统业务页面
 *         title:
 *           type: string
 *           description: 页面标题
 *     RouterConfigUserRouterQueryResponse:
 *       type: object
 *       properties:
 *         path:
 *           type: string
 *           description: 路由路径
 *         componentName:
 *           type: string
 *           description: 路由组件名
 *         meta:
 *           $ref: '#/components/schemas/RouterMeta'
 *         name:
 *           type: string
 *           description: 路由Name
 *     ArticleTagsTagsQueryResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: 标签id
 *         tag_name:
 *           type: string
 *           description: 标签名称
 *     ArticleTagsTagsQueryRequest:
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
 *           $ref: '#/components/schemas/UserStanding'
 *           description: 用户类型值
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
 *         user_name:
 *           type: string
 *           description: 用户名
 *         user_code:
 *           type: string
 *           description: 用户Code
 *         standing:
 *           $ref: '#/components/schemas/UserStanding'
 *           description: 用户身份
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
 *         tagId:
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
 *         reading_quantity:
 *           type: integer
 *           description: 文章阅读量
 *         author:
 *           type: integer
 *           description: 作者id
 *         author_name:
 *           type: string
 *           description: 作者名
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
 *         reading_quantity:
 *           type: integer
 *           description: 文章阅读量
 *         author:
 *           type: integer
 *           description: 作者id
 *         author_name:
 *           type: string
 *           description: 作者名称
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
 *         article_tree_id:
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
 *         reading_quantity:
 *           type: integer
 *           description: 文章阅读量
 *         author:
 *           type: integer
 *           description: 作者id
 *         author_name:
 *           type: string
 *           description: 作者名称
 *         add_time:
 *           type: string
 *           format: date-time
 *           description: 文章发布时间
 *         content:
 *           type: string
 *           description: 文章的内容
 *         content_html:
 *           type: string
 *           description: 文章的内容（包含html标签元素）
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
 *         content_html:
 *           type: string
 *           description: 新增文章的内容（包含html标签元素）
 *         article_tree_id:
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
 *         content_html:
 *           type: string
 *           description: 新增文章的内容（包含html标签元素）
 *         article_tree_id:
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
 *         article_tree_id:
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
 *         content_html:
 *           type: string
 *           description: 文章内容HTML格式
 *         reading_quantity:
 *           type: integer
 *           description: 文章阅读量
 *         author:
 *           type: integer
 *           description: 作者id
 *         author_name:
 *           type: string
 *           description: 作者名称
 *         add_time:
 *           type: string
 *           format: date-time
 *           description: 文章发布时间
 *         tag_names:
 *           type: string
 *           description: 文章标签拼接
 *         tag_ids:
 *           type: string
 *           description: 文章标签id拼接
 *         tags:
 *           type: array
 *           description: 文章标签列表
 *           items:
 *             $ref: '#/components/schemas/SelectListItem'
 *         article_tree_id:
 *           type: integer
 *           description: 文章所属目录id
 *         article_tree_name:
 *           type: string
 *           description: 文章所属目录名称
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
 *         status_name:
 *           type: string
 *           description: 状态名称
 *         status_value:
 *           $ref: '#/components/schemas/ArticleStatus'
 *           description: 状态值
 *         author:
 *           type: integer
 *           description: 作者id
 *         author_name:
 *           type: string
 *           description: 作者名称
 *     BlogBackstageArticleAllQueryRequest:
 *       type: object
 *       properties:
 *         pageIndex:
 *           type: integer
 *           description: 要获取的页数
 *         pageSize:
 *           type: integer
 *           description: 每页显示的文章数量
 *     ArticleTreeArticleTreeNameQueryResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: 文章树id
 *         article_tree_name:
 *           type: string
 *           description: 文章树名称
 *         parent_article_tree_id:
 *           type: integer
 *           description: 父级文章树id
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
 *         article_tree_id:
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
