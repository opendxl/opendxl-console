<?xml version="1.0" encoding="UTF-8" ?>
<object class="kapow.robot.plugin.common.robot.Web20EditionRESTRobot" serializationversion="0">
  <property name="roboTechVersion" class="java.lang.String">6&#x2e;3</property>
  <property name="startModelObjects" class="kapow.robot.robomaker.state.ModelObjects">
    <element class="kapow.robot.common.domain.Entity">
      <property name="entityModel" class="kapow.robot.common.domain.EntityModelReference">
        <property name="entityModelName" class="java.lang.String">RESTOutput</property>
      </property>
      <property name="name1" class="java.lang.String">name</property>
      <property name="name2" class="java.lang.String">type</property>
    </element>
  </property>
  <property name="queryParameters" class="kapow.robot.robomaker.state.ModelObjects">
    <element class="kapow.robot.common.domain.Entity">
      <property name="entityModel" class="kapow.robot.common.domain.EntityModelReference">
        <property name="entityModelName" class="java.lang.String">RESTInput</property>
      </property>
    </element>
  </property>
  <property name="proxyServerConfiguration" class="kapow.util.net.ProxyServerConfiguration">
  </property>
  <property name="httpClientType" class="kapow.util.net.httpclient.HttpClientType">
    <property name="enum-name" class="java.lang.String">APACHE</property>
  </property>
  <property name="comment">
    <null>
    </null>
  </property>
  <property name="id" class="java.lang.Integer">&#x2d;1</property>
  <property name="transitionGraph" class="kapow.robot.robomaker.robot.TransitionGraph">
    <transitions class="java.util.LinkedList">
      <object class="kapow.robot.robomaker.robot.Transition" id="0">
        <property name="name" class="java.lang.String">Load&#x20;Page</property>
        <property name="stateProcessor" class="kapow.robot.plugin.common.stateprocessor.PageLoader5StateProcessor">
          <property name="urlProvider" class="kapow.robot.plugin.common.support.url.provider.SpecifiedURLProvider">
            <property name="url" class="java.lang.String">http&#x3a;&#x2f;&#x2f;localhost&#x3a;50080&#x2f;admin</property>
          </property>
          <property name="browserConfigurationSpecification" class="kapow.robot.plugin.common.support.browser2.BrowserConfigurationSpecification" serializationversion="0">
          </property>
        </property>
        <property name="nodeFinderList" class="kapow.robot.robomaker.state.document.nodefinder.list.NodeFinderList" id="1">
        </property>
        <property name="errorHandlingMode" class="java.lang.Integer">0</property>
        <property name="branchingMode" class="kapow.robot.robomaker.robot.BranchingMode" id="2">
          <mode class="java.lang.Integer">0</mode>
        </property>
        <property name="comment">
          <null>
          </null>
        </property>
        <property name="id" class="java.lang.Integer">0</property>
        <property name="errorPropagationMode" class="java.lang.Integer">0</property>
      </object>
      <object class="kapow.robot.robomaker.robot.Transition" id="3">
        <property name="name" class="java.lang.String">Return&#x20;Response</property>
        <property name="stateProcessor" class="kapow.robot.plugin.common.stateprocessor.ModelDone" serializationversion="0">
          <property name="modelObject" class="kapow.robot.plugin.common.support.ModelName">
            <property name="name" class="java.lang.String">RESTOutput</property>
          </property>
        </property>
        <property name="nodeFinderList" idref="1">
        </property>
        <property name="errorHandlingMode" class="java.lang.Integer">0</property>
        <property name="branchingMode" idref="2">
        </property>
        <property name="comment">
          <null>
          </null>
        </property>
        <property name="id" class="java.lang.Integer">1</property>
        <property name="errorPropagationMode" class="java.lang.Integer">0</property>
      </object>
      <object class="kapow.robot.robomaker.robot.Transition" id="4">
        <property name="name" class="java.lang.String">For&#x20;Each&#x20;Tag&#x20;Path</property>
        <property name="stateProcessor" class="kapow.robot.plugin.common.stateprocessor.NodePathIterator2StateProcessor">
          <property name="nodePath" class="java.lang.String">&#x2e;table&#x2e;thead&#x7c;tbody&#x7c;tfoot&#x2e;tr</property>
          <property name="firstIndex" class="java.lang.Integer">1</property>
        </property>
        <property name="nodeFinderList" class="kapow.robot.robomaker.state.document.nodefinder.list.NodeFinderList">
          <object class="kapow.robot.robomaker.state.document.nodefinder.defaultnodefinder.DefaultReferenceNodeAwareNodeFinder">
            <property name="nodePath" class="java.lang.String">&#x2e;&#x2a;&#x2e;div&#x2e;table</property>
            <property name="attributeName" class="java.lang.String">class</property>
            <property name="attributeValue" class="kapow.robot.plugin.common.support.predicate.unary.string.FixedStringPredicate">
              <property name="text" class="java.lang.String">grid</property>
            </property>
          </object>
        </property>
        <property name="errorHandlingMode" class="java.lang.Integer">0</property>
        <property name="branchingMode" idref="2">
        </property>
        <property name="comment">
          <null>
          </null>
        </property>
        <property name="id" class="java.lang.Integer">5</property>
        <property name="errorPropagationMode" class="java.lang.Integer">0</property>
      </object>
      <object class="kapow.robot.robomaker.robot.Transition" id="5">
        <property name="name" class="java.lang.String">Extract&#x20;Value&#x20;1</property>
        <property name="stateProcessor" class="kapow.robot.plugin.common.stateprocessor.SimpleExtractor2" serializationversion="0">
          <property name="attributeName" class="kapow.robot.plugin.common.support.AttributeName2">
            <property name="name" class="java.lang.String">RESTOutput&#x2e;value1</property>
          </property>
        </property>
        <property name="nodeFinderList" class="kapow.robot.robomaker.state.document.nodefinder.list.NodeFinderList">
          <object class="kapow.robot.robomaker.state.document.nodefinder.defaultnodefinder.DefaultReferenceNodeAwareNodeFinder">
            <property name="referenceNodeRelation" class="kapow.robot.robomaker.state.document.nodefinder.referencenode.relation.InReferenceNodeRelation">
              <property name="referenceNodeIndex" class="kapow.robot.robomaker.state.document.nodefinder.referencenode.ReferenceNodeIndex">
              </property>
            </property>
            <property name="nodePath" class="java.lang.String">&#x2e;&#x2a;&#x2e;a</property>
          </object>
        </property>
        <property name="errorHandlingMode" class="java.lang.Integer">0</property>
        <property name="branchingMode" idref="2">
        </property>
        <property name="comment">
          <null>
          </null>
        </property>
        <property name="id" class="java.lang.Integer">6</property>
        <property name="errorPropagationMode" class="java.lang.Integer">0</property>
      </object>
      <object class="kapow.robot.robomaker.robot.Transition" id="6">
        <property name="name" class="java.lang.String">Extract&#x20;Value&#x20;2</property>
        <property name="stateProcessor" class="kapow.robot.plugin.common.stateprocessor.SimpleExtractor2" serializationversion="0">
          <property name="domToTextConverter" class="kapow.robot.plugin.common.support.vtopia.converter.HTMLTextOutputtingHTMLDOMToTextConverter">
          </property>
          <property name="stringProcessors" class="kapow.robot.robomaker.stringprocessor.StringProcessors">
            <element class="kapow.robot.plugin.common.stringprocessor.ExtractStringProcessor">
              <property name="pattern" class="java.lang.String">&#x2e;&#x2a;span&#x20;class&#x3d;&#x22;&#x28;&#x2e;&#x2a;&#x3f;&#x29;&#x22;&#x2e;&#x2a;</property>
            </element>
            <element class="kapow.robot.plugin.common.stringprocessor.Converter">
              <property name="mapString" class="java.lang.String">feedicon&#x3d;rss&#xa;resticon&#x3d;rest</property>
            </element>
          </property>
          <property name="attributeName" class="kapow.robot.plugin.common.support.AttributeName2">
            <property name="name" class="java.lang.String">RESTOutput&#x2e;value2</property>
          </property>
        </property>
        <property name="nodeFinderList" class="kapow.robot.robomaker.state.document.nodefinder.list.NodeFinderList">
          <object class="kapow.robot.robomaker.state.document.nodefinder.defaultnodefinder.DefaultReferenceNodeAwareNodeFinder">
            <property name="referenceNodeRelation" class="kapow.robot.robomaker.state.document.nodefinder.referencenode.relation.InReferenceNodeRelation">
              <property name="referenceNodeIndex" class="kapow.robot.robomaker.state.document.nodefinder.referencenode.ReferenceNodeIndex">
              </property>
            </property>
            <property name="nodePath" class="java.lang.String">&#x2e;&#x2a;&#x2e;td</property>
          </object>
        </property>
        <property name="errorHandlingMode" class="java.lang.Integer">0</property>
        <property name="branchingMode" class="kapow.robot.robomaker.robot.BranchingMode">
          <mode class="java.lang.Integer">0</mode>
        </property>
        <property name="comment">
          <null>
          </null>
        </property>
        <property name="id" class="java.lang.Integer">12</property>
        <property name="errorPropagationMode" class="java.lang.Integer">0</property>
      </object>
    </transitions>
    <edges class="java.util.ArrayList">
      <object class="kapow.robot.robomaker.robot.TransitionEdge">
        <from idref="0">
        </from>
        <to idref="4">
        </to>
        <attachment>
          <null>
          </null>
        </attachment>
      </object>
      <object class="kapow.robot.robomaker.robot.TransitionEdge">
        <from idref="4">
        </from>
        <to idref="5">
        </to>
        <attachment>
          <null>
          </null>
        </attachment>
      </object>
      <object class="kapow.robot.robomaker.robot.TransitionEdge">
        <from idref="5">
        </from>
        <to idref="6">
        </to>
        <attachment>
          <null>
          </null>
        </attachment>
      </object>
      <object class="kapow.robot.robomaker.robot.TransitionEdge">
        <from idref="6">
        </from>
        <to idref="3">
        </to>
        <attachment>
          <null>
          </null>
        </attachment>
      </object>
    </edges>
  </property>
  <property name="startTransition" idref="0">
  </property>
  <property name="nextTransitionId" class="java.lang.Integer">13</property>
  <property name="browserConfigurationSpecification" class="kapow.robot.plugin.common.support.browser2.BrowserConfigurationSpecification" serializationversion="0">
  </property>
  <property name="xmlResultFormatSpecification" class="kapow.robot.plugin.common.support.openkapow.restresult.XMLRESTResultFormatSpecification">
  </property>
  <property name="htmlResultFormatSpecification" class="kapow.robot.plugin.common.support.openkapow.restresult.HTMLRESTResultFormatSpecification">
  </property>
  <property name="csvResultFormatSpecification" class="kapow.robot.plugin.common.support.openkapow.restresult.CSVRESTResultFormatSpecification">
  </property>
  <property name="jsonResultFormatSpecification" class="kapow.robot.plugin.common.support.openkapow.restresult.JSONRESTResultFormatSpecification">
  </property>
  <property name="defaultResultFormat" class="java.lang.String">xml</property>
  <property name="serviceName" class="java.lang.String">ISCVBListAllRobots</property>
  <property name="description">
    <null>
    </null>
  </property>
</object>
