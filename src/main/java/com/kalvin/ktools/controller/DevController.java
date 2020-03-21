package com.kalvin.ktools.controller;

import cn.hutool.core.bean.BeanUtil;
import com.kalvin.ktools.comm.annotation.SiteStats;
import com.kalvin.ktools.comm.constant.KApi;
import com.kalvin.ktools.comm.kit.KApiKit;
import com.kalvin.ktools.dto.R;
import com.kalvin.ktools.service.CmdCategoryService;
import com.kalvin.ktools.service.LinuxCmdService;
import com.kalvin.ktools.vo.StressTestingVO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import javax.annotation.Resource;

/**
 * 开发者工具 控制层
 */
@RestController
@RequestMapping(value = "dev")
public class DevController {

    private final static Logger LOGGER = LoggerFactory.getLogger(DevController.class);

    @Autowired
    private CmdCategoryService cmdCategoryService;

    @Autowired
    private LinuxCmdService linuxCmdService;

    @Resource
    private KApi kApi;

    @Value(value = "${kt.kapi.token}")
    private String reqToken;

    @SiteStats
    @GetMapping(value = "stress/testing")
    public ModelAndView stressTest() {
        return new ModelAndView("dev/stress_testing.html");
    }

    @SiteStats
    @GetMapping(value = "json/format")
    public ModelAndView jsonFormat() {
        return new ModelAndView("dev/json_format.html");
    }

    @SiteStats
    @GetMapping(value = "linux/cmd")
    public ModelAndView linuxCmd() {
        ModelAndView mv = new ModelAndView("dev/linux_cmd.html");
        mv.addObject("cmdCategories", cmdCategoryService.getCmdCategories());
        return mv;
    }

    @SiteStats
    @GetMapping(value = "colorPicker")
    public ModelAndView colorPicker() {
        return new ModelAndView("dev/color_picker.html");
    }

    @SiteStats
    @GetMapping(value = "markdown")
    public ModelAndView markdown() {
        return new ModelAndView("dev/markdown_editor");
    }

    @SiteStats
    @GetMapping(value = "jsHtmlCss/format")
    public ModelAndView jsHtmlCssFormat() {
        return new ModelAndView("dev/js_html_css_format");
    }

    /**
     * 压力测试
     * @param stressTestingVO 压力测试参数
     * @return r
     */
    @SiteStats
    @PostMapping(value = "stressTesting")
    public R stressTesting(StressTestingVO stressTestingVO) {
        if (stressTestingVO.getUrls().contains("tools.kalvinbg.cn")) {
            return R.fail("你坏坏哦，用本站网址测试，我不答应。");
        }
        if (stressTestingVO.getConcurrent() > 300) { // 并发数最大限制300
            stressTestingVO.setConcurrent(300);
        }
        if (stressTestingVO.getReps() > 35) {
            stressTestingVO.setReps(35);
        }
        String post = KApiKit.post(kApi.getDevStressTestingUrl(), BeanUtil.beanToMap(stressTestingVO), reqToken);
//        LOGGER.info("post={}", post);
        return KApiKit.respone2R(post);
    }

    /**
     * linux命令查询
     * @param word 关键词
     * @param type 方式：0-普通的模糊查询 1-高级的模糊查询
     * @return
     */
    @SiteStats
    @GetMapping(value = "linuxCmd/query")
    public R linuxCmdQuery(String word, Integer type) {
        if (type == 0) {
            return R.ok(linuxCmdService.getByCmdOrName(word));
        } else if (type == 1) {
            return R.ok(linuxCmdService.getByKeyword(word));
        } else {
            return R.fail("参数异常");
        }
    }

    /**
     * linux命令查询,按分类
     * @param cmdCategoryId 命令分类ID
     * @return
     */
    @SiteStats
    @GetMapping(value = "linuxCmd/category")
    public R linuxCmdCategory(Long cmdCategoryId) {
        return R.ok(linuxCmdService.getByCmdCategoryId(cmdCategoryId));
    }

}
