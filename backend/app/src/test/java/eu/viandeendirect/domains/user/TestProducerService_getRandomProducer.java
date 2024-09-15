package eu.viandeendirect.domains.user;

import eu.viandeendirect.model.Producer;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.mockito.Mockito;

import java.util.Iterator;
import java.util.List;
import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.spy;

class TestProducerService_getRandomProducer {

    private static Producer producer1 = new Producer();
    private static Producer producer2 = new Producer();
    private static Producer producer3 = new Producer();

    public static Stream<Arguments> getCases() {
        return Stream.of(
                Arguments.of(List.of(producer1), 0.1, producer1),
                Arguments.of(List.of(producer1), 0.8, producer1),
                Arguments.of(List.of(producer1, producer2), 0.2, producer1),
                Arguments.of(List.of(producer1, producer2), 0.7, producer2),
                Arguments.of(List.of(producer1, producer2, producer3), 0.5, producer2),
                Arguments.of(List.of(producer1, producer2, producer3), 0.9, producer3),
                Arguments.of(List.of(), 0.5, null)
        );
    }

    @BeforeAll
    static void initProducers() {
        producer1.setFarmName("La ferme des pommiers");
        producer2.setFarmName("GAEC des frères Bross");
        producer3.setFarmName("EARL du Granier");
    }


    @ParameterizedTest
    @MethodSource("getCases")
    void should_return_first_producer_if_only_one_producer(List<Producer> producers, double random, Producer expectedProducer) {
        // given
        Iterator<Producer> producerIterator = producers.iterator();
        int producerCount = producers.size();
        var service = spy(ProducerService.class);
        doReturn(random).when(service).getRandom();

        // when
        Producer randomProducer = service.getRandomProducer(producerCount, producerIterator);

        // then
        Assertions.assertThat(randomProducer).isEqualTo(expectedProducer);
    }
}