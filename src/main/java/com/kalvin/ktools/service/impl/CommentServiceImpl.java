package com.kalvin.ktools.service.impl;

import cn.hutool.http.HttpUtil;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.kalvin.ktools.comm.kit.HttpServletContextKit;
import com.kalvin.ktools.dao.CommentDao;
import com.kalvin.ktools.dto.CommentDTO;
import com.kalvin.ktools.dto.UserCommentsDTO;
import com.kalvin.ktools.entity.*;
import com.kalvin.ktools.exception.KTException;
import com.kalvin.ktools.service.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

/**
 * <p>
 * 工具评论表 服务实现类
 * </p>
 *
 * @author Kalvin
 * @since 2019-04-12
 */
@Service
public class CommentServiceImpl extends ServiceImpl<CommentDao, Comment> implements CommentService {

    private final static Logger LOGGER = LoggerFactory.getLogger(CommentServiceImpl.class);

    @Autowired
    private TrafficStatisticsService trafficStatisticsService;
    @Autowired
    private UserService userService;
    @Autowired
    private ToolLikeService toolLikeService;
    @Autowired
    private CommentGiveDetailService giveDetailService;
    @Autowired
    private MenuService menuService;

    @Override
    public UserCommentsDTO getUserComments(Comment comment) {
        // 获取IP地址
        HttpServletRequest request = HttpServletContextKit.getHttpServletRequest();
        String ip = HttpUtil.getClientIP(request);
        ip = "0:0:0:0:0:0:0:1".equals(ip) ? "127.0.0.1" : ip;
        TrafficStatistics trafficStatistics = trafficStatisticsService.getById(ip);

        Long userId = trafficStatistics.getUserId();
        User user = userService.getById(userId);
        ToolLike toolLike = toolLikeService.getOne(new QueryWrapper<ToolLike>().lambda()
                .eq(ToolLike::getUserId, userId).eq(ToolLike::getMenuId, comment.getMenuId()));

        UserCommentsDTO userComments = new UserCommentsDTO();

        if (toolLike != null) {
            userComments.setLikeIt(toolLike.getLikeIt());
        }

        // 工具喜欢数
        Menu menu = menuService.getById(comment.getMenuId());
        userComments.setLikeNum(menu.getLikeNum());

        // 当前用户信息
        userComments.setUserId(userId);
        userComments.setMenuId(comment.getMenuId());
        userComments.setNickname(user.getNickname());
        userComments.setAvatar(user.getAvatar());

//        List<Comment> comments = commentService.list(new QueryWrapper<Comment>().lambda().eq(Comment::getMenuId, menuId));
        comment.setUserId(userId);
        Page<CommentDTO> commentsPage = this.getCommentsByPage(comment);

        userComments.setComments(commentsPage);
        LOGGER.info("userComments={}", userComments);
        return userComments;
    }

    @Override
    public Page<CommentDTO> getCommentsByPage(Comment comment) {
        Page<CommentDTO> page = new Page<>(comment.getCurrent(), comment.getSize());
        List<CommentDTO> commentDTOS = baseMapper.selectCommentsWithUser(comment.getMenuId(), comment.getUserId(), page);
        page.setRecords(commentDTOS);
        return page;
    }

    @Override
    public Comment addComment(Comment comment) {
        final String[] keywords = new String[]{"script", "style", "iframe", "html", "body", "img", "t66y.com", "object", "document.write", "document", "onload", "setTimeout", "alert", "frame", "location", "eval", "open", "setInterval", "src", "href", "video", "onerror"};
        String comm = comment.getComment();

        for (String keyword : keywords) {
            comm = comm.replace(keyword, "?");
        }

        if (comment.getMenuId() != 8L) {
            comm = comm.replace("<", "&lt;").replace(">", "&gt;");
        }
        comment.setComment(comm);
        super.save(comment);
        return comment;
    }

    @Override
    @Transactional
    public void giveLike(Long id, Long giveLikeUserId) {
        CommentGiveDetail giveDetail = giveDetailService.getByCUId(id, giveLikeUserId);
        if (giveDetail == null) {
            giveDetail = new CommentGiveDetail(id, giveLikeUserId, 1);
        } else {
            giveDetail.setLikeIt(1);
        }
        giveDetailService.saveOrUpdate(giveDetail);

        this.upLikeNum(id);
    }

    @Override
    @Transactional
    public void dislike(Long id, Long giveLikeUserId) {
        CommentGiveDetail giveDetail = giveDetailService.getByCUId(id, giveLikeUserId);
        if (giveDetail == null) {
            giveDetail = new CommentGiveDetail(id, giveLikeUserId, 0);
        } else {
            giveDetail.setLikeIt(0);
        }
        giveDetailService.saveOrUpdate(giveDetail);

        this.downLikeNum(id);
    }

    @Override
    public void upLikeNum(Long id) {
        Comment comment = super.getById(id);
        Integer likeNum = comment.getCommentLikeNum();
        comment.setCommentLikeNum(++likeNum);
        super.updateById(comment);
    }

    @Override
    public void downLikeNum(Long id) {
        Comment comment = super.getById(id);
        Integer likeNum = comment.getCommentLikeNum();
        if (likeNum == 0) {
            throw new KTException("downLikeNum fail. the likeNum is 0");
        }
        comment.setCommentLikeNum(--likeNum);
        super.updateById(comment);
    }
}
